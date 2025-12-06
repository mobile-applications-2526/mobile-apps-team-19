package com.example.Event;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.example.models.Event;
import com.example.models.User;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

public class EventTest {

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

    private User john;
    private User jane;
    private User bob;

    @BeforeEach
    public void setup() {
        john = new User("john_doe", "john@example.com", "John", "Doe", "password123");
        jane = new User("jane_smith", "jane@example.com", "Jane", "Smith", "password456");
        bob = new User("bob_wilson", "bob@example.com", "Bob", "Wilson", "password789");
    }

    @Test
    public void givenValidEvent_whenCreatingEvent_thenEventIsCreated() {
        Event event = new Event("Football", LocalDate.now().plusDays(2), "Testuser", LocalTime.of(20, 0, 0),
                LocalTime.of(23, 0, 0), Arrays.asList(bob, john, jane), null, "Kampenhout");
        Set<ConstraintViolation<Event>> violations = validator.validate(event);
        assertTrue(violations.isEmpty());
        assertNotNull(event);
        assertEquals("Football", event.getName());
        assertEquals("Testuser", event.getHostName());
        assertEquals(LocalTime.of(20, 0, 0), event.getStartTime());
        assertEquals(LocalTime.of(23, 0, 0), event.getEndTime());
        assertEquals("Kampenhout", event.getLocation());
    }

    @Test
    public void givenEmptyName_whenCreatingEvent_thenErrorIsThrown() {
        Event event = new Event("", LocalDate.now().plusDays(2), "Testuser", LocalTime.of(20, 0, 0),
                LocalTime.of(23, 0, 0), Arrays.asList(bob, john, jane), null, "Kampenhout");
        Set<ConstraintViolation<Event>> violations = validator.validate(event);
        assertFalse(violations.isEmpty());
        assertNotNull(event);
        assertEquals(1, violations.size());
        ConstraintViolation<Event> violation = violations.iterator().next();
        assertEquals("Event name cannot be blank", violation.getMessage());
    }

    @Test
    public void givenEmptyHostName_whenCreatingEvent_thenErrorIsThrown() {
        Event event = new Event("Football", LocalDate.now().plusDays(2), "", LocalTime.of(20, 0, 0),
                LocalTime.of(23, 0, 0), Arrays.asList(bob, john, jane), null, "Kampenhout");
        Set<ConstraintViolation<Event>> violations = validator.validate(event);
        assertFalse(violations.isEmpty());
        assertNotNull(event);
        assertEquals(1, violations.size());
        ConstraintViolation<Event> violation = violations.iterator().next();
        assertEquals("Host name cannot be blank", violation.getMessage());
    }

    @Test
    public void givenNullDate_whenCreatingEvent_thenErrorIsThrown() {
        Event event = new Event("Football", null, "Testuser", LocalTime.of(20, 0, 0),
                LocalTime.of(23, 0, 0), Arrays.asList(bob, john, jane), null, "Kampenhout");
        Set<ConstraintViolation<Event>> violations = validator.validate(event);
        assertFalse(violations.isEmpty());
        assertNotNull(event);
        assertEquals(1, violations.size());
        ConstraintViolation<Event> violation = violations.iterator().next();
        assertEquals("Event date cannot be null", violation.getMessage());
    }

    @Test
    public void givenPastDate_whenCreatingEvent_thenErrorIsThrown() {
        Event event = new Event("Football", LocalDate.now().minusDays(1), "Testuser", LocalTime.of(20, 0, 0),
                LocalTime.of(23, 0, 0), Arrays.asList(bob, john, jane), null, "Kampenhout");
        Set<ConstraintViolation<Event>> violations = validator.validate(event);
        assertFalse(violations.isEmpty());
        assertNotNull(event);
        assertEquals(1, violations.size());
        ConstraintViolation<Event> violation = violations.iterator().next();
        assertEquals("Event date cannot be in the past", violation.getMessage());
    }

    @Test
    public void givenNullStartTime_whenCreatingEvent_thenErrorIsThrown() {
        Event event = new Event("Football", LocalDate.now().plusDays(2), "Testuser", null,
                LocalTime.of(23, 0, 0), Arrays.asList(bob, john, jane), null, "Kampenhout");
        Set<ConstraintViolation<Event>> violations = validator.validate(event);
        assertFalse(violations.isEmpty());
        assertNotNull(event);
        assertEquals(1, violations.size());
        ConstraintViolation<Event> violation = violations.iterator().next();
        assertEquals("Event start time cannot be null", violation.getMessage());
    }

    @Test
    public void givenNullEndTime_whenCreatingEvent_thenErrorIsThrown() {
        Event event = new Event("Football", LocalDate.now().plusDays(2), "Testuser", LocalTime.of(20, 0, 0),
                null, Arrays.asList(bob, john, jane), null, "Kampenhout");
        Set<ConstraintViolation<Event>> violations = validator.validate(event);
        assertFalse(violations.isEmpty());
        assertNotNull(event);
        assertEquals(1, violations.size());
        ConstraintViolation<Event> violation = violations.iterator().next();
        assertEquals("Event end time cannot be null", violation.getMessage());
    }
}
