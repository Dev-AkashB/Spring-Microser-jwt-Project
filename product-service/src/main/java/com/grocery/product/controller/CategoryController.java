package com.grocery.product.controller;

import com.grocery.product.dto.CategoryDto;
import com.grocery.product.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody CategoryDto dto,
                                            @RequestHeader(value = "X-User-Roles", required = false) String roles) {
        if (roles != null && !roles.contains("ROLE_ADMIN")) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied: Admin role required"));
        }
        return ResponseEntity.ok(categoryService.createCategory(dto));
    }
}
