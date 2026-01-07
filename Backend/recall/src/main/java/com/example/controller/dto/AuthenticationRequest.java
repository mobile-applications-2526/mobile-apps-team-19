package com.example.controller.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AuthenticationRequest(
                @JsonProperty(value = "username", required = false) String username,

                @JsonProperty(value = "email", required = false) String email,

                @JsonProperty(value = "password", required = true) String password) {
        public String getUsernameOrEmail() {
                return username != null ? username : email;
        }
}
