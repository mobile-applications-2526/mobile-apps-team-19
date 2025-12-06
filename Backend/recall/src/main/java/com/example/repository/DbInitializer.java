package com.example.repository;

import org.springframework.stereotype.Component;

import com.example.models.User;

import jakarta.annotation.PostConstruct;

@Component
public class DbInitializer {

    private final UserRepository userRepository;

    public DbInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void clearAll() {
        userRepository.deleteAll();

    }

    @PostConstruct
    public void init() {
        clearAll();

        userRepository.save(new User("admin123", "admin@ucll.be", "admin", "admin", "password"));
    }

}
