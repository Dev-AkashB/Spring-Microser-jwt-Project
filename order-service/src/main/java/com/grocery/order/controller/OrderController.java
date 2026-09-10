package com.grocery.order.controller;

import com.grocery.order.dto.CheckoutRequest;
import com.grocery.order.dto.OrderResponseDto;
import com.grocery.order.dto.OrderStatusUpdateRequest;
import com.grocery.order.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader(value = "X-User-Email", required = false, defaultValue = "") String email,
            @RequestHeader(value = "X-User-Name", required = false, defaultValue = "Valued Customer") String name,
            @RequestBody CheckoutRequest request) {
        try {
            OrderResponseDto response = orderService.checkout(userId, email, name, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/user")
    public ResponseEntity<List<OrderResponseDto>> getUserOrders(
            @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }

    @GetMapping
    public ResponseEntity<?> getAllOrders(
            @RequestHeader(value = "X-User-Roles", required = false) String roles) {
        if (roles != null && !roles.contains("ROLE_ADMIN")) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied: Admin role required"));
        }
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(orderService.getOrderById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody OrderStatusUpdateRequest req,
            @RequestHeader(value = "X-User-Roles", required = false) String roles) {
        if (roles != null && !roles.contains("ROLE_ADMIN") && !roles.contains("ROLE_DELIVERY")) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied: Admin or Delivery role required"));
        }
        try {
            return ResponseEntity.ok(orderService.updateOrderStatus(id, req.getStatus()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader(value = "X-User-Roles", required = false) String roles) {
        boolean isAdmin = roles != null && roles.contains("ROLE_ADMIN");
        try {
            return ResponseEntity.ok(orderService.cancelOrder(id, userId, isAdmin));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
