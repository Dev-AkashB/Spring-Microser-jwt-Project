package com.grocery.order.service;

import com.grocery.order.client.ProductClient;
import com.grocery.order.client.dto.ProductDto;
import com.grocery.order.dto.AddToCartRequest;
import com.grocery.order.dto.CartItemDto;
import com.grocery.order.dto.CartResponse;
import com.grocery.order.entity.CartItem;
import com.grocery.order.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductClient productClient;

    public CartResponse getCart(Long userId) {
        List<CartItem> items = cartRepository.findByUserId(userId);
        List<CartItemDto> dtoList = items.stream().map(this::mapToDto).collect(Collectors.toList());

        BigDecimal subtotal = dtoList.stream()
                .map(CartItemDto::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Free delivery if subtotal > $35, else $3.99 delivery fee
        BigDecimal deliveryFee = (subtotal.compareTo(BigDecimal.valueOf(35)) >= 0 || subtotal.compareTo(BigDecimal.ZERO) == 0)
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(3.99);

        // 5% sales tax
        BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.05)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = subtotal.add(deliveryFee).add(tax);

        CartResponse res = new CartResponse();
        res.setItems(dtoList);
        res.setSubtotal(subtotal);
        res.setDeliveryFee(deliveryFee);
        res.setTax(tax);
        res.setTotalAmount(total);
        return res;
    }

    @Transactional
    public CartItemDto addToCart(Long userId, AddToCartRequest req) {
        ProductDto product = productClient.getProductById(req.getProductId());
        if (product == null || !product.isActive()) {
            throw new IllegalArgumentException("Product not found or unavailable");
        }

        Optional<CartItem> existing = cartRepository.findByUserIdAndProductId(userId, req.getProductId());
        CartItem item;
        if (existing.isPresent()) {
            item = existing.get();
            item.setQuantity(item.getQuantity() + req.getQuantity());
            item.setUnitPrice(product.getEffectivePrice());
        } else {
            item = new CartItem(
                    userId,
                    product.getId(),
                    product.getName(),
                    product.getUnit(),
                    product.getEffectivePrice(),
                    req.getQuantity(),
                    product.getImageUrl()
            );
        }

        CartItem saved = cartRepository.save(item);
        return mapToDto(saved);
    }

    @Transactional
    public CartItemDto updateQuantity(Long userId, Long cartItemId, int quantity) {
        CartItem item = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found: " + cartItemId));

        if (!item.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized to modify this cart item");
        }

        if (quantity <= 0) {
            cartRepository.delete(item);
            return null;
        }

        item.setQuantity(quantity);
        CartItem saved = cartRepository.save(item);
        return mapToDto(saved);
    }

    @Transactional
    public void removeItem(Long userId, Long cartItemId) {
        CartItem item = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found: " + cartItemId));
        if (!item.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized to modify this cart item");
        }
        cartRepository.delete(item);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartRepository.deleteByUserId(userId);
    }

    private CartItemDto mapToDto(CartItem item) {
        CartItemDto dto = new CartItemDto();
        dto.setId(item.getId());
        dto.setProductId(item.getProductId());
        dto.setProductName(item.getProductName());
        dto.setProductUnit(item.getProductUnit());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setQuantity(item.getQuantity());
        dto.setSubtotal(item.getSubtotal());
        dto.setImageUrl(item.getImageUrl());
        return dto;
    }
}
