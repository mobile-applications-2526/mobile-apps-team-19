package com.example.controller.dto;

public record AuthenticationResponse(
        String token,
        String username
) {
}
