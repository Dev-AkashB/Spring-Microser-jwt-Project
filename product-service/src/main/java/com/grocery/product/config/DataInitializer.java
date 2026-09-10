package com.grocery.product.config;

import com.grocery.product.entity.Category;
import com.grocery.product.entity.Product;
import com.grocery.product.repository.CategoryRepository;
import com.grocery.product.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            Category produce = categoryRepository.save(new Category("Fresh Fruits & Veggies", "Farm fresh organic fruits and vegetables", "🍎"));
            Category dairy = categoryRepository.save(new Category("Dairy, Bread & Eggs", "Fresh milk, artisan breads, cheese, and farm eggs", "🥛"));
            Category pantry = categoryRepository.save(new Category("Pantry & Staples", "Rice, grains, pulses, oils, and spices", "🌾"));
            Category snacks = categoryRepository.save(new Category("Snacks & Beverages", "Chips, cookies, juices, soda, coffee, and teas", "🍪"));
            Category household = categoryRepository.save(new Category("Household & Essentials", "Cleaning supplies, paper towels, and personal care", "🧼"));

            List<Product> items = List.of(
                // Produce
                new Product("Organic Royal Gala Apples", "Crisp, sweet, and locally harvested fresh organic apples.",
                        new BigDecimal("3.99"), new BigDecimal("3.49"), "1 kg (approx 5-6 apples)", 120,
                        "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop", produce),
                new Product("Fresh Hass Avocados", "Creamy, ripe avocados perfect for salads and guacamole.",
                        new BigDecimal("4.49"), new BigDecimal("3.99"), "Pack of 3", 85,
                        "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&auto=format&fit=crop", produce),
                new Product("Organic Baby Spinach", "Pre-washed tender baby spinach leaves rich in iron and antioxidants.",
                        new BigDecimal("2.99"), null, "300 g container", 60,
                        "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop", produce),
                new Product("Ripe Cherry Tomatoes", "Juicy and vibrant red sweet cherry tomatoes on the vine.",
                        new BigDecimal("2.79"), new BigDecimal("2.29"), "500 g punnet", 95,
                        "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop", produce),

                // Dairy
                new Product("Whole Vitamin D Organic Milk", "Pasteurized homogenized organic farm-fresh whole milk.",
                        new BigDecimal("3.89"), null, "1 Gallon (3.78 L)", 150,
                        "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop", dairy),
                new Product("Pasture-Raised Brown Eggs", "Large grade A pasture-raised brown eggs with rich golden yolks.",
                        new BigDecimal("4.99"), new BigDecimal("4.29"), "Carton of 12", 110,
                        "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=500&auto=format&fit=crop", dairy),
                new Product("Artisanal Sourdough Bread", "Traditional naturally fermented sourdough with crunchy golden crust.",
                        new BigDecimal("4.49"), null, "600 g Loaf", 45,
                        "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=500&auto=format&fit=crop", dairy),
                new Product("Aged Sharp Cheddar Cheese", "Rich and creamy sharp white cheddar block aged for 12 months.",
                        new BigDecimal("5.49"), new BigDecimal("4.89"), "250 g block", 70,
                        "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&auto=format&fit=crop", dairy),

                // Pantry
                new Product("Extra Virgin Cold-Pressed Olive Oil", "First cold-pressed Mediterranean extra virgin olive oil.",
                        new BigDecimal("12.99"), new BigDecimal("10.99"), "750 ml Glass Bottle", 50,
                        "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop", pantry),
                new Product("Royal Himalayan Basmati Rice", "Aromatic extra long grain premium basmati rice aged to perfection.",
                        new BigDecimal("8.99"), null, "5 kg Bag", 65,
                        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop", pantry),
                new Product("Organic Raw Honey", "100% pure unfiltered wildflower honey harvested responsibly.",
                        new BigDecimal("7.49"), new BigDecimal("6.79"), "500 g Jar", 40,
                        "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop", pantry),

                // Snacks
                new Product("Kettle Cooked Sea Salt Chips", "Golden, crunchy potato chips cooked in small batches.",
                        new BigDecimal("3.29"), null, "200 g Bag", 80,
                        "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop", snacks),
                new Product("Cold Pressed Fresh Orange Juice", "100% pure squeezed Florida oranges with light pulp.",
                        new BigDecimal("4.19"), new BigDecimal("3.69"), "1 Liter Bottle", 75,
                        "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop", snacks),

                // Household
                new Product("Plant-Based Eco Dish Soap", "Biodegradable, tough on grease with refreshing citrus scent.",
                        new BigDecimal("3.99"), null, "750 ml Bottle", 90,
                        "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop", household)
            );

            productRepository.saveAll(items);
            System.out.println(">>> Pre-seeded " + items.size() + " grocery catalog products across 5 categories.");
        }
    }
}
