package com.example.config;


import java.net.URL;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

@ConfigurationProperties(prefix = "cors")
public record CorsProperties(
                @DefaultValue("http://localhost:8000") List<URL> allowedOrigins,
                @DefaultValue({"GET", "POST", "PUT", "DELETE", "OPTIONS"}) List<String> allowedMethods,
                @DefaultValue({"Authorization", "Content-Type"}) List<String> allowedHeaders) {
}
