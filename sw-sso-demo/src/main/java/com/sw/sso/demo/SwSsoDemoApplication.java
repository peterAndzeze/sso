package com.sw.sso.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.sw.sso"})
public class SwSsoDemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(SwSsoDemoApplication.class, args);
    }

}

