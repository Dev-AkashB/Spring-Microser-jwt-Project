package com.grocery.product.service;

import com.grocery.product.dto.CategoryDto;
import com.grocery.product.entity.Category;
import com.grocery.product.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(c -> new CategoryDto(c.getId(), c.getName(), c.getDescription(), c.getIcon()))
                .collect(Collectors.toList());
    }

    public CategoryDto createCategory(CategoryDto dto) {
        Category category = new Category(dto.getName(), dto.getDescription(), dto.getIcon());
        Category saved = categoryRepository.save(category);
        return new CategoryDto(saved.getId(), saved.getName(), saved.getDescription(), saved.getIcon());
    }
}
