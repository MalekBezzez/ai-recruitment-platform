package com.example.moduleproject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients(basePackages = "com.example.moduleproject.feign")

@SpringBootApplication

public class ModuleProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(ModuleProjectApplication.class, args);
    }

}
