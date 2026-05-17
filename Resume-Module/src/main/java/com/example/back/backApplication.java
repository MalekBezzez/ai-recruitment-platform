package com.example.back;

import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableRabbit      // ➜ pour activer la détection @RabbitListener
@EnableScheduling
@EnableFeignClients

public class backApplication {

    public static void main(String[] args) {
        SpringApplication.run(backApplication.class, args);
    }


}
