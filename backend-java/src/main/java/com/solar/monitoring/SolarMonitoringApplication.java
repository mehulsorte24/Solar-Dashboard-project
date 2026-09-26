package com.solar.monitoring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SolarMonitoringApplication {

    public static void main(String[] args) {
        SpringApplication.run(SolarMonitoringApplication.class, args);
        System.out.println("==========================================================");
        System.out.println("☀️ IIoT Solar Monitoring Java Spring Boot Backend Started!");
        System.out.println("REST API: http://localhost:8000/api/dashboard");
        System.out.println("==========================================================");
    }
}
