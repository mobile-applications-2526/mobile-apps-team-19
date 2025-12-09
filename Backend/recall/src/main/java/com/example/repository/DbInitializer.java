package com.example.repository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.models.User;

import jakarta.annotation.PostConstruct;

@Component
public class DbInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DbInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void clearAll() {
        userRepository.deleteAll();

    }

    @PostConstruct
    public void init() {
        clearAll();

        userRepository
                .save(new User("admin123", "admin@ucll.be", "admin", "admin", passwordEncoder.encode("password")));
    }

}
