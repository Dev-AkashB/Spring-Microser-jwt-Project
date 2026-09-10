package com.grocery.product.controller;

import com.grocery.product.dto.ProductDto;
import com.grocery.product.dto.StockOperationRequest;
import com.grocery.product.dto.StockOperationResponse;
import com.grocery.product.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductDto>> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(productService.getProducts(categoryId, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(productService.getProductById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody ProductDto dto,
                                           @RequestHeader(value = "X-User-Roles", required = false) String roles) {
        // Admin authorization check via Gateway injected header
        if (roles != null && !roles.contains("ROLE_ADMIN")) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied: Admin role required"));
        }
        try {
            return ResponseEntity.ok(productService.createProduct(dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id,
                                           @RequestBody ProductDto dto,
                                           @RequestHeader(value = "X-User-Roles", required = false) String roles) {
        if (roles != null && !roles.contains("ROLE_ADMIN")) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied: Admin role required"));
        }
        try {
            return ResponseEntity.ok(productService.updateProduct(id, dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id,
                                           @RequestHeader(value = "X-User-Roles", required = false) String roles) {
        if (roles != null && !roles.contains("ROLE_ADMIN")) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied: Admin role required"));
        }
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(Map.of("message", "Product marked inactive successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/deduct-stock")
    public ResponseEntity<StockOperationResponse> deductStock(@RequestBody StockOperationRequest request) {
        StockOperationResponse response = productService.deductStock(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/restore-stock")
    public ResponseEntity<StockOperationResponse> restoreStock(@RequestBody StockOperationRequest request) {
        return ResponseEntity.ok(productService.restoreStock(request));
    }
}
