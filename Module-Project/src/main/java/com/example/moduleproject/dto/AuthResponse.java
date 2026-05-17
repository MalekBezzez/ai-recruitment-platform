package com.example.moduleproject.dto;

public class AuthResponse {
    private String access_token;
    private UserResponse user;

    // Constructeur
    public AuthResponse(String access_token, UserResponse user) {
        this.access_token = access_token;
        this.user = user;
    }

    // Getters et Setters
    public String getAccess_token() {
        return access_token;
    }

    public void setAccess_token(String access_token) {
        this.access_token = access_token;
    }

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }
}
