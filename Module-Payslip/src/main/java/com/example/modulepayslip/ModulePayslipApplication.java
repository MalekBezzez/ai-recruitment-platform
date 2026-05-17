package com.example.modulepayslip;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients

public class ModulePayslipApplication {

    public static void main(String[] args) {
        SpringApplication.run(ModulePayslipApplication.class, args);
    }

}
