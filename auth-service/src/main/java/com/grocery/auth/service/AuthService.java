package com.grocery.auth.service;

import com.grocery.auth.dto.*;
import com.grocery.auth.entity.Address;
import com.grocery.auth.entity.Role;
import com.grocery.auth.entity.User;
import com.grocery.auth.repository.AddressRepository;
import com.grocery.auth.repository.UserRepository;
import com.grocery.auth.security.CustomUserDetails;
import com.grocery.auth.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use: " + request.getEmail());
        }

        Set<Role> roles = new HashSet<>();
        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            for (String r : request.getRoles()) {
                try {
                    roles.add(Role.valueOf(r.toUpperCase().trim()));
                } catch (IllegalArgumentException ignored) {
                    roles.add(Role.ROLE_CUSTOMER);
                }
            }
        } else {
            roles.add(Role.ROLE_CUSTOMER);
        }

        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName(),
                request.getPhone(),
                roles
        );

        User savedUser = userRepository.save(user);

        CustomUserDetails userDetails = new CustomUserDetails(savedUser);
        Set<String> roleNames = savedUser.getRoles().stream().map(Enum::name).collect(Collectors.toSet());
        String token = jwtService.generateToken(userDetails, savedUser.getId(), roleNames);

        return new AuthResponse(token, savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(), roleNames);
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        Set<String> roleNames = user.getRoles().stream().map(Enum::name).collect(Collectors.toSet());
        String token = jwtService.generateToken(userDetails, user.getId(), roleNames);

        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), roleNames);
    }

    public UserProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setPhone(user.getPhone());
        response.setRoles(user.getRoles().stream().map(Enum::name).collect(Collectors.toSet()));

        List<AddressDto> addressDtos = user.getAddresses().stream().map(a -> {
            AddressDto dto = new AddressDto();
            dto.setId(a.getId());
            dto.setStreet(a.getStreet());
            dto.setCity(a.getCity());
            dto.setState(a.getState());
            dto.setPostalCode(a.getPostalCode());
            dto.setCountry(a.getCountry());
            dto.setDefault(a.isDefault());
            return dto;
        }).collect(Collectors.toList());

        response.setAddresses(addressDtos);
        return response;
    }

    @Transactional
    public AddressDto addAddress(String email, AddressDto addressDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (addressDto.isDefault()) {
            user.getAddresses().forEach(a -> a.setDefault(false));
        }

        Address address = new Address(
                addressDto.getStreet(),
                addressDto.getCity(),
                addressDto.getState(),
                addressDto.getPostalCode(),
                addressDto.getCountry(),
                addressDto.isDefault()
        );
        user.addAddress(address);
        Address saved = addressRepository.save(address);

        addressDto.setId(saved.getId());
        return addressDto;
    }

    public List<UserProfileResponse> getAllUsers() {
        return userRepository.findAll().stream().map(user -> {
            UserProfileResponse dto = new UserProfileResponse();
            dto.setId(user.getId());
            dto.setEmail(user.getEmail());
            dto.setFullName(user.getFullName());
            dto.setPhone(user.getPhone());
            dto.setRoles(user.getRoles().stream().map(Enum::name).collect(Collectors.toSet()));
            return dto;
        }).collect(Collectors.toList());
    }
}
