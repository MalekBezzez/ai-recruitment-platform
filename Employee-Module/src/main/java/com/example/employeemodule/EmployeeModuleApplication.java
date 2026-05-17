package com.example.employeemodule;

import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.example.employeemodule.Repository")
@EntityScan(basePackages = "com.example.employeemodule.entity")
@EnableFeignClients(basePackages = "com.example.employeemodule.feign")
@EnableRabbit
public class EmployeeModuleApplication {

    public static void main(String[] args) {
        SpringApplication.run(EmployeeModuleApplication.class, args);
    }

}
