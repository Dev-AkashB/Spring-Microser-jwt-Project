package com.grocery.order.service;

import com.grocery.order.client.PaymentClient;
import com.grocery.order.client.ProductClient;
import com.grocery.order.client.dto.*;
import com.grocery.order.dto.CheckoutRequest;
import com.grocery.order.dto.OrderItemDto;
import com.grocery.order.dto.OrderResponseDto;
import com.grocery.order.entity.CartItem;
import com.grocery.order.entity.Order;
import com.grocery.order.entity.OrderItem;
import com.grocery.order.entity.OrderStatus;
import com.grocery.order.repository.CartRepository;
import com.grocery.order.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductClient productClient;

    @Autowired
    private PaymentClient paymentClient;

    @Transactional
    public OrderResponseDto checkout(Long userId, String email, String fullName, CheckoutRequest request) {
        List<OrderItemInfo> itemsToProcess = new ArrayList<>();

        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (CheckoutRequest.CheckoutItem ci : request.getItems()) {
                ProductDto prod = productClient.getProductById(ci.getProductId());
                if (prod == null || !prod.isActive()) {
                    throw new IllegalArgumentException("Product not available: ID " + ci.getProductId());
                }
                itemsToProcess.add(new OrderItemInfo(prod.getId(), prod.getName(), prod.getUnit(), prod.getEffectivePrice(), ci.getQuantity()));
            }
        } else {
            List<CartItem> cartItems = cartRepository.findByUserId(userId);
            if (cartItems.isEmpty()) {
                throw new IllegalArgumentException("Shopping cart is empty");
            }
            for (CartItem ci : cartItems) {
                itemsToProcess.add(new OrderItemInfo(ci.getProductId(), ci.getProductName(), ci.getProductUnit(), ci.getUnitPrice(), ci.getQuantity()));
            }
        }

        // 1. Deduct stock in Product Service via Feign
        List<StockItem> stockItems = itemsToProcess.stream()
                .map(i -> new StockItem(i.productId, i.quantity))
                .collect(Collectors.toList());

        StockOperationResponse stockRes = productClient.deductStock(new StockOperationRequest(stockItems));
        if (!stockRes.isSuccess()) {
            throw new IllegalStateException("Checkout failed: " + stockRes.getMessage());
        }

        // 2. Calculate totals
        BigDecimal subtotal = itemsToProcess.stream()
                .map(i -> i.unitPrice.multiply(BigDecimal.valueOf(i.quantity)))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal deliveryFee = (subtotal.compareTo(BigDecimal.valueOf(35)) >= 0)
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(3.99);

        BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.05)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = subtotal.add(deliveryFee).add(tax);

        // 3. Build Order
        String orderNum = "GROC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Order order = new Order();
        order.setOrderNumber(orderNum);
        order.setUserId(userId);
        order.setCustomerEmail(email);
        order.setCustomerName(fullName);
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setRecipientPhone(request.getRecipientPhone());
        order.setSubtotal(subtotal);
        order.setDeliveryFee(deliveryFee);
        order.setTax(tax);
        order.setTotalAmount(total);
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "CASH_ON_DELIVERY");
        order.setStatus(OrderStatus.CONFIRMED);

        for (OrderItemInfo itemInfo : itemsToProcess) {
            BigDecimal itemSubtotal = itemInfo.unitPrice.multiply(BigDecimal.valueOf(itemInfo.quantity));
            OrderItem orderItem = new OrderItem(
                    itemInfo.productId,
                    itemInfo.productName,
                    itemInfo.productUnit,
                    itemInfo.unitPrice,
                    itemInfo.quantity,
                    itemSubtotal
            );
            order.addItem(orderItem);
        }

        Order savedOrder = orderRepository.save(order);

        // 4. Process Payment & Delivery via Feign
        try {
            PaymentRequest payReq = new PaymentRequest(
                    savedOrder.getId(),
                    userId,
                    total,
                    savedOrder.getPaymentMethod(),
                    savedOrder.getDeliveryAddress(),
                    fullName,
                    savedOrder.getRecipientPhone()
            );
            PaymentResponse payRes = paymentClient.processPayment(payReq);
            savedOrder.setPaymentTransactionId(payRes.getTransactionId());
            savedOrder.setDeliveryTrackingCode(payRes.getTrackingCode());
            savedOrder = orderRepository.save(savedOrder);
        } catch (Exception e) {
            System.err.println("Notice: Payment service call completed with fallback: " + e.getMessage());
        }

        // 5. Clear cart
        cartRepository.deleteByUserId(userId);

        return mapToResponseDto(savedOrder);
    }

    public List<OrderResponseDto> getOrdersByUser(Long userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public List<OrderResponseDto> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public OrderResponseDto getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + id));
        return mapToResponseDto(order);
    }

    @Transactional
    public OrderResponseDto updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + orderId));

        order.setStatus(status);
        Order updated = orderRepository.save(order);
        return mapToResponseDto(updated);
    }

    @Transactional
    public OrderResponseDto cancelOrder(Long orderId, Long userId, boolean isAdmin) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + orderId));

        if (!isAdmin && !order.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized to cancel this order");
        }

        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.CANCELLED) {
            throw new IllegalStateException("Order cannot be cancelled in status: " + order.getStatus());
        }

        // 1. Restore Stock in Product Service
        List<StockItem> stockItems = order.getItems().stream()
                .map(i -> new StockItem(i.getProductId(), i.getQuantity()))
                .collect(Collectors.toList());
        try {
            productClient.restoreStock(new StockOperationRequest(stockItems));
        } catch (Exception ignored) {}

        // 2. Trigger Refund in Payment Service
        try {
            paymentClient.refund(order.getId());
        } catch (Exception ignored) {}

        order.setStatus(OrderStatus.CANCELLED);
        Order saved = orderRepository.save(order);
        return mapToResponseDto(saved);
    }

    private OrderResponseDto mapToResponseDto(Order order) {
        OrderResponseDto dto = new OrderResponseDto();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setUserId(order.getUserId());
        dto.setCustomerEmail(order.getCustomerEmail());
        dto.setCustomerName(order.getCustomerName());
        dto.setDeliveryAddress(order.getDeliveryAddress());
        dto.setRecipientPhone(order.getRecipientPhone());
        dto.setSubtotal(order.getSubtotal());
        dto.setDeliveryFee(order.getDeliveryFee());
        dto.setTax(order.getTax());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setStatus(order.getStatus());
        dto.setPaymentTransactionId(order.getPaymentTransactionId());
        dto.setDeliveryTrackingCode(order.getDeliveryTrackingCode());
        dto.setOrderDate(order.getOrderDate());

        List<OrderItemDto> itemDtos = order.getItems().stream().map(i -> {
            OrderItemDto d = new OrderItemDto();
            d.setId(i.getId());
            d.setProductId(i.getProductId());
            d.setProductName(i.getProductName());
            d.setProductUnit(i.getProductUnit());
            d.setUnitPrice(i.getUnitPrice());
            d.setQuantity(i.getQuantity());
            d.setSubtotal(i.getSubtotal());
            return d;
        }).collect(Collectors.toList());

        dto.setItems(itemDtos);
        return dto;
    }

    private static class OrderItemInfo {
        Long productId;
        String productName;
        String productUnit;
        BigDecimal unitPrice;
        Integer quantity;

        OrderItemInfo(Long productId, String productName, String productUnit, BigDecimal unitPrice, Integer quantity) {
            this.productId = productId;
            this.productName = productName;
            this.productUnit = productUnit;
            this.unitPrice = unitPrice;
            this.quantity = quantity;
        }
    }
}
