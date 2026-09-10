package com.grocery.payment.controller;

import com.grocery.payment.dto.DeliveryStatusUpdateRequest;
import com.grocery.payment.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/delivery")
public class DeliveryController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getDeliveryByOrderId(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(paymentService.getDeliveryByOrderId(orderId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/status")
    public ResponseEntity<?> updateDeliveryStatus(@RequestBody DeliveryStatusUpdateRequest request) {
        try {
            return ResponseEntity.ok(paymentService.updateDeliveryStatus(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }
}
