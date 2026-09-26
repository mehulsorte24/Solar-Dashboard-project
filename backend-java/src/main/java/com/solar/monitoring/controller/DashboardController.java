package com.solar.monitoring.controller;

import com.solar.monitoring.model.SensorReading;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class DashboardController {

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("current_power", 966.0);
        summary.put("today_energy", 12.48);
        summary.put("voltage", 230.4);
        summary.put("current", 4.19);
        summary.put("temperature", 31.0);
        summary.put("humidity", 77.8);
        summary.put("comm_status", "EXCELLENT");
        summary.put("comm_rssi", -26.0);
        summary.put("comm_snr", 9.75);
        summary.put("system_status", "RUNNING");
        summary.put("last_updated", LocalDateTime.now().toString());
        summary.put("active_alerts_count", 1);

        Map<String, Boolean> health = new HashMap<>();
        health.put("sensor_dht22", true);
        health.put("energy_meter", true);
        health.put("lora_tx", true);
        health.put("lora_rx", true);
        health.put("raspberry_pi", true);
        health.put("mqtt_broker", true);
        health.put("postgresql_db", true);
        health.put("plc", true);
        health.put("scada", true);

        summary.put("health", health);
        return summary;
    }

    @GetMapping("/readings/latest")
    public SensorReading getLatestReading() {
        return new SensorReading("TX001", 31.0, 77.8, 230.4, 4.19, 966.0, 12.48, -26.0, 9.75, 0.14);
    }
}
