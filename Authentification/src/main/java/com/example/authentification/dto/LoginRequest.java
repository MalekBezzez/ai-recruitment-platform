package com.example.authentification.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    private String email;
    private String password;



        // Getter pour email
        public String getEmail() {
            return email;
        }

        // Setter pour email
        public void setEmail(String email) {
            this.email = email;
        }

        // Getter pour password
        public String getPassword() {
            return password;
        }

        // Setter pour password
        public void setPassword(String password) {
            this.password = password;
        }


}
