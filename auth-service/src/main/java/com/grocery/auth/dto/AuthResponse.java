package com.grocery.auth.dto;

import java.util.Set;

public class AuthResponse {
    private String token;
    private Long userId;
    private String email;
    private String fullName;
    private Set<String> roles;

    public AuthResponse() {}

    public AuthResponse(String token, Long userId, String email, String fullName, Set<String> roles) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
        this.roles = roles;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }
}
