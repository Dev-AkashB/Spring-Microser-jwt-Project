package com.grocery.payment.service;

import com.grocery.payment.dto.DeliveryStatusUpdateRequest;
import com.grocery.payment.dto.PaymentRequest;
import com.grocery.payment.dto.PaymentResponse;
import com.grocery.payment.entity.*;
import com.grocery.payment.repository.DeliveryRepository;
import com.grocery.payment.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Transactional
    public PaymentResponse processPayment(PaymentRequest request) {
        // Generate transaction ID
        String txnId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        PaymentStatus status = (request.getPaymentMethod() == PaymentMethod.CASH_ON_DELIVERY)
                ? PaymentStatus.PENDING
                : PaymentStatus.SUCCESS;

        Payment payment = new Payment(
                request.getOrderId(),
                request.getUserId(),
                request.getAmount(),
                request.getPaymentMethod(),
                status,
                txnId
        );
        Payment savedPayment = paymentRepository.save(payment);

        // Schedule delivery
        String trackingCode = "TRK-" + UUID.randomUUID().toString().substring(0, 10).toUpperCase();
        LocalDateTime estimated = LocalDateTime.now().plusHours(2); // Grocery quick delivery in 2 hours

        Delivery delivery = new Delivery(
                request.getOrderId(),
                request.getDeliveryAddress(),
                request.getRecipientName(),
                request.getRecipientPhone(),
                DeliveryStatus.SCHEDULED,
                trackingCode,
                estimated
        );
        Delivery savedDelivery = deliveryRepository.save(delivery);

        return mapToResponse(savedPayment, savedDelivery);
    }

    public PaymentResponse getPaymentByOrderId(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found for order id: " + orderId));
        Delivery delivery = deliveryRepository.findByOrderId(orderId).orElse(null);
        return mapToResponse(payment, delivery);
    }

    public List<PaymentResponse> getPaymentsByUserId(Long userId) {
        return paymentRepository.findByUserId(userId).stream()
                .map(p -> {
                    Delivery d = deliveryRepository.findByOrderId(p.getOrderId()).orElse(null);
                    return mapToResponse(p, d);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public PaymentResponse refund(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found for order id: " + orderId));

        payment.setStatus(PaymentStatus.REFUNDED);
        Payment savedPayment = paymentRepository.save(payment);

        Delivery delivery = deliveryRepository.findByOrderId(orderId).orElse(null);
        if (delivery != null) {
            delivery.setStatus(DeliveryStatus.CANCELLED);
            deliveryRepository.save(delivery);
        }

        return mapToResponse(savedPayment, delivery);
    }

    @Transactional
    public Delivery updateDeliveryStatus(DeliveryStatusUpdateRequest request) {
        Delivery delivery = deliveryRepository.findByOrderId(request.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("Delivery not found for order id: " + request.getOrderId()));

        delivery.setStatus(request.getStatus());
        delivery.setUpdatedAt(LocalDateTime.now());
        return deliveryRepository.save(delivery);
    }

    public Delivery getDeliveryByOrderId(Long orderId) {
        return deliveryRepository.findByOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Delivery not found for order id: " + orderId));
    }

    private PaymentResponse mapToResponse(Payment payment, Delivery delivery) {
        PaymentResponse res = new PaymentResponse();
        res.setPaymentId(payment.getId());
        res.setOrderId(payment.getOrderId());
        res.setUserId(payment.getUserId());
        res.setAmount(payment.getAmount());
        res.setPaymentMethod(payment.getPaymentMethod());
        res.setStatus(payment.getStatus());
        res.setTransactionId(payment.getTransactionId());
        res.setPaymentDate(payment.getPaymentDate());

        if (delivery != null) {
            res.setTrackingCode(delivery.getTrackingCode());
            res.setDeliveryStatus(delivery.getStatus());
            res.setEstimatedDeliveryTime(delivery.getEstimatedDeliveryTime());
        }
        return res;
    }
}
