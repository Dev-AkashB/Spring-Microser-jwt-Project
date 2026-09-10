package com.grocery.auth.config;

import com.grocery.auth.entity.Address;
import com.grocery.auth.entity.Role;
import com.grocery.auth.entity.User;
import com.grocery.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            // Seed Admin User
            User admin = new User(
                    "admin@grocery.com",
                    passwordEncoder.encode("admin123"),
                    "System Admin",
                    "+1-800-555-0199",
                    Set.of(Role.ROLE_ADMIN, Role.ROLE_CUSTOMER)
            );
            userRepository.save(admin);

            // Seed Customer User
            User customer = new User(
                    "john@example.com",
                    passwordEncoder.encode("customer123"),
                    "John Doe",
                    "+1-555-0143",
                    Set.of(Role.ROLE_CUSTOMER)
            );
            Address address = new Address(
                    "742 Evergreen Terrace",
                    "Springfield",
                    "Oregon",
                    "97477",
                    "USA",
                    true
            );
            customer.addAddress(address);
            userRepository.save(customer);

            System.out.println(">>> Pre-seeded Admin (admin@grocery.com / admin123) and Customer (john@example.com / customer123)");
        }
    }
}
