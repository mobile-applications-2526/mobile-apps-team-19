package com.example.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtPropertiesConfig {
    private String secretKey;
    private String tokenIssuer;
    private String tokenLifetime;

    public String getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    public String getTokenIssuer() {
        return tokenIssuer;
    }

    public void setTokenIssuer(String tokenIssuer) {
        this.tokenIssuer = tokenIssuer;
    }

    public String getTokenLifetime() {
        return tokenLifetime;
    }

    public void setTokenLifetime(String tokenLifetime) {
        this.tokenLifetime = tokenLifetime;
    }
}
