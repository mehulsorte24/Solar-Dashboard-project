package com.solar.monitoring.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sensor_readings")
public class SensorReading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long readingId;

    @Column(nullable = false)
    private String deviceId;

    private LocalDateTime timestamp;
    private Double temperature;
    private Double humidity;
    private Double voltage;
    private Double current;
    private Double power;
    private Double energy;
    private Double rssi;
    private Double snr;
    private Double packetLoss;

    public SensorReading() {
        this.timestamp = LocalDateTime.now();
    }

    public SensorReading(String deviceId, Double temperature, Double humidity, Double voltage, Double current, Double power, Double energy, Double rssi, Double snr, Double packetLoss) {
        this.deviceId = deviceId;
        this.timestamp = LocalDateTime.now();
        this.temperature = temperature;
        this.humidity = humidity;
        this.voltage = voltage;
        this.current = current;
        this.power = power;
        this.energy = energy;
        this.rssi = rssi;
        this.snr = snr;
        this.packetLoss = packetLoss;
    }

    // Getters and Setters
    public Long getReadingId() { return readingId; }
    public void setReadingId(Long readingId) { this.readingId = readingId; }

    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public Double getHumidity() { return humidity; }
    public void setHumidity(Double humidity) { this.humidity = humidity; }

    public Double getVoltage() { return voltage; }
    public void setVoltage(Double voltage) { this.voltage = voltage; }

    public Double getCurrent() { return current; }
    public void setCurrent(Double current) { this.current = current; }

    public Double getPower() { return power; }
    public void setPower(Double power) { this.power = power; }

    public Double getEnergy() { return energy; }
    public void setEnergy(Double energy) { this.energy = energy; }

    public Double getRssi() { return rssi; }
    public void setRssi(Double rssi) { this.rssi = rssi; }

    public Double getSnr() { return snr; }
    public void setSnr(Double snr) { this.snr = snr; }

    public Double getPacketLoss() { return packetLoss; }
    public void setPacketLoss(Double packetLoss) { this.packetLoss = packetLoss; }
}
