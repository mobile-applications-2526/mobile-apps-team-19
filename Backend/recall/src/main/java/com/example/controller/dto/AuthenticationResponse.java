package com.example.controller.dto;

public record AuthenticationResponse(
        String message,
        String token,
        String username
) {
}
