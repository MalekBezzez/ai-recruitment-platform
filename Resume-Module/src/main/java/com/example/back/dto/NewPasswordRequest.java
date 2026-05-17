package com.example.back.dto;



import jakarta.validation.constraints.NotBlank;

public class NewPasswordRequest {

    @NotBlank
    private String token;

    @NotBlank
    private String newPassword;

    // Constructeur par défaut
    public NewPasswordRequest() {}

    // Constructeur avec paramètres
    public NewPasswordRequest(String token, String newPassword) {
        this.token = token;
        this.newPassword = newPassword;
    }

    // Getters et Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
