package com.example.User;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Set;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.example.models.User;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

public class UserTest {

    private static ValidatorFactory validatorFactory;
    private static Validator validator;

    @BeforeAll
    public static void createValidator() {
        validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }

    @AfterAll
    public static void close() {
        validatorFactory.close();
    }

    @Test
    public void givenValidUser_whenCreatingUser_thenUserIsCreated() {
        User user = new User("Test", "test@ucll.be", "test", "test", "test123");
        Set<ConstraintViolation<User>> violations = validator.validate(user);
        assertTrue(violations.isEmpty());
        assertNotNull(user);
        assertEquals("Test", user.getUsername());
        assertEquals("test@ucll.be", user.getEmail());
        assertEquals("test", user.getFirstName());
        assertEquals("test", user.getLastName());
        assertEquals("test123", user.getPassword());

    }

    @Test
    public void givenEmptyUsername_whenCreatingUser_thenErrorIsThrown() {
        User user = new User("", "test@ucll.be", "test", "test", "test123");
        Set<ConstraintViolation<User>> violations = validator.validate(user);
        assertFalse(violations.isEmpty());
        assertNotNull(user);
        assertEquals(violations.size(), 1);
        ConstraintViolation<User> violation = violations.iterator().next();
        assertEquals("Username cannot be blank", violation.getMessage());
    }

    @Test
    public void givenEmptyFirstName_whenCreatingUser_thenErrorIsThrown() {
        User user = new User("Test", "test@ucll.be", "", "test", "test123");
        Set<ConstraintViolation<User>> violations = validator.validate(user);
        assertFalse(violations.isEmpty());
        assertNotNull(user);
        assertEquals(violations.size(), 1);
        ConstraintViolation<User> violation = violations.iterator().next();
        assertEquals("First name cannot be blank", violation.getMessage());
    }

    @Test
    public void givenEmptyLastName_whenCreatingUser_thenErrorIsThrown() {
        User user = new User("Test", "test@ucll.be", "test", "", "test123");
        Set<ConstraintViolation<User>> violations = validator.validate(user);
        assertFalse(violations.isEmpty());
        assertNotNull(user);
        assertEquals(violations.size(), 1);
        ConstraintViolation<User> violation = violations.iterator().next();
        assertEquals("Last name cannot be blank", violation.getMessage());
    }

    // @Test
    // public void givenInvalidEmail_whenCreatingUser_thenErrorIsThrown() {
    // User user = new User("Test", "invalid-email", "test", "test", "test123");
    // Set<ConstraintViolation<User>> violations = validator.validate(user);
    // assertFalse(violations.isEmpty());
    // assertNotNull(user);
    // assertEquals(violations.size(), 1);
    // ConstraintViolation<User> violation = violations.iterator().next();
    // assertEquals("Email should be valid", violation.getMessage());
    // }

    @Test
    public void givenEmptyEmail_whenCreatingUser_thenErrorIsThrown() {
        User user = new User("Test", "", "test", "test", "test123");
        Set<ConstraintViolation<User>> violations = validator.validate(user);
        assertFalse(violations.isEmpty());
        assertNotNull(user);
        assertEquals(violations.size(), 1);
        ConstraintViolation<User> violation = violations.iterator().next();
        assertEquals("Email cannot be blank", violation.getMessage());
    }

    @Test
    public void givenShortPassword_whenCreatingUser_thenErrorIsThrown() {
        User user = new User("Test", "test@ucll.be", "test", "test", "123");
        Set<ConstraintViolation<User>> violations = validator.validate(user);
        assertFalse(violations.isEmpty());
        assertNotNull(user);
        assertEquals(violations.size(), 1);
        ConstraintViolation<User> violation = violations.iterator().next();
        assertEquals("Password must be at least 6 characters long", violation.getMessage());
    }

}