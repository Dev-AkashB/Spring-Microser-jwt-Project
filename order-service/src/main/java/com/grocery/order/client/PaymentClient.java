package com.grocery.order.client;

import com.grocery.order.client.dto.PaymentRequest;
import com.grocery.order.client.dto.PaymentResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "payment-service")
public interface PaymentClient {

    @PostMapping("/api/payments/process")
    PaymentResponse processPayment(@RequestBody PaymentRequest request);

    @PostMapping("/api/payments/refund/{orderId}")
    PaymentResponse refund(@PathVariable("orderId") Long orderId);
}
