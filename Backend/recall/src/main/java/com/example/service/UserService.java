package com.example.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.controller.dto.AuthenticationResponse;
import com.example.controller.dto.UserInput;
import com.example.models.User;
import com.example.repository.UserRepository;

@Service
public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public UserService(
            UserRepository userRepository,
            JwtService jwtService,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public AuthenticationResponse signIn(String username, String password) {
        log.info("Login attempt for username: {}", username);
        try {
            final var usernamePasswordAuthentication = new UsernamePasswordAuthenticationToken(username, password);
            final var authentication = authenticationManager.authenticate(usernamePasswordAuthentication);
            final var user = ((UserDetailsImpl) authentication.getPrincipal()).user();
            final var token = jwtService.generateToken(user);
            log.info("Login successful for username: {}", username);
            return new AuthenticationResponse(
                    "Login successful",
                    token,
                    user.getUsername());
        } catch (BadCredentialsException e) {
            log.error("Login failed for username: {} - Bad credentials", username);
            throw e;
        }
    }

    public User signup(UserInput userInput) {
        if (userRepository.existsByUsername(userInput.username())) {
            throw new RuntimeException("Username is already in use.");
        }

        final var hashedPassword = passwordEncoder.encode(userInput.password());
        final var user = new User(
                userInput.username(),
                userInput.firstName(),
                userInput.lastName(),
                userInput.email(),
                hashedPassword);

        return userRepository.save(user);
    }

}
