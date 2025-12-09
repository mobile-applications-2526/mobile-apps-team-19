package com.example.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

import java.time.Duration;

@ConfigurationProperties(prefix = "jwt")
public record JwtProperties(String secretKey,
                @DefaultValue Token token) {
        public record Token(String issuer,
                        Duration lifetime) {
        }
}