package com.example.moduleleave;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients(basePackages = "com.example.moduleleave.Feign")
public class ModuleLeaveApplication {

    public static void main(String[] args) {
        SpringApplication.run(ModuleLeaveApplication.class, args);
    }

}
