package com.grocery.auth.dto;

public class SsoLoginRequest {
    private String provider;  // e.g. "GOOGLE", "GITHUB"
    private String email;     // User's email from SSO provider
    private String fullName;  // User's display name
    private String avatarUrl; // User's profile picture URL
    private String idToken;   // Optional OAuth ID token / credential
    private String phone;     // Optional phone number

    public SsoLoginRequest() {}

    public SsoLoginRequest(String provider, String email, String fullName) {
        this.provider = provider;
        this.email = email;
        this.fullName = fullName;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getIdToken() {
        return idToken;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
