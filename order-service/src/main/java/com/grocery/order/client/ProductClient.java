package com.grocery.order.client;

import com.grocery.order.client.dto.ProductDto;
import com.grocery.order.client.dto.StockOperationRequest;
import com.grocery.order.client.dto.StockOperationResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "product-service")
public interface ProductClient {

    @GetMapping("/api/products/{id}")
    ProductDto getProductById(@PathVariable("id") Long id);

    @PostMapping("/api/products/deduct-stock")
    StockOperationResponse deductStock(@RequestBody StockOperationRequest request);

    @PostMapping("/api/products/restore-stock")
    StockOperationResponse restoreStock(@RequestBody StockOperationRequest request);
}
