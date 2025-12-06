package com.example.repository;

import org.springframework.stereotype.Component;

import com.example.models.User;
import com.example.models.Event;
import com.example.models.Picture;

import jakarta.annotation.PostConstruct;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.ArrayList;

@Component
public class DbInitializer {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final PictureRepository pictureRepository;

    public DbInitializer(UserRepository userRepository, EventRepository eventRepository,
            PictureRepository pictureRepository) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.pictureRepository = pictureRepository;
    }

    public void clearAll() {
        pictureRepository.deleteAll();
        eventRepository.deleteAll();
        userRepository.deleteAll();
    }

    @PostConstruct
    public void init() {
        clearAll();

        // Create users
        User admin = userRepository.save(new User("admin123", "admin@ucll.be", "Admin", "User", "password"));
        User john = userRepository.save(new User("john_doe", "john@example.com", "John", "Doe", "password123"));
        User jane = userRepository.save(new User("jane_smith", "jane@example.com", "Jane", "Smith", "password456"));
        User bob = userRepository.save(new User("bob_wilson", "bob@example.com", "Bob", "Wilson", "password789"));
        User alice = userRepository.save(new User("alice_brown", "alice@example.com", "Alice", "Brown", "password321"));

        // Create events with users
        Event summerPicnic = new Event(
                "Summer Picnic 2025",
                LocalDate.of(2025, 7, 15),
                "Alice Brown",
                LocalTime.of(12, 0),
                LocalTime.of(18, 0),
                Arrays.asList(admin, john, jane, alice),
                new ArrayList<>(),
                "Central Park");
        summerPicnic = eventRepository.save(summerPicnic);

        Event beachParty = new Event(
                "Beach Volleyball Tournament",
                LocalDate.of(2025, 8, 20),
                "John Doe",
                LocalTime.of(10, 0),
                LocalTime.of(16, 0),
                Arrays.asList(john, bob, jane),
                new ArrayList<>(),
                "Sandy Beach Resort");
        beachParty = eventRepository.save(beachParty);

        Event christmasGala = new Event(
                "Christmas Gala Night",
                LocalDate.of(2025, 12, 24),
                "Admin User",
                LocalTime.of(19, 0),
                LocalTime.of(23, 59),
                Arrays.asList(admin, john, jane, bob, alice),
                new ArrayList<>(),
                "Grand Hotel Ballroom");
        christmasGala = eventRepository.save(christmasGala);

        Event birthdayBash = new Event(
                "Bob's 30th Birthday Bash",
                LocalDate.of(2025, 9, 10),
                "Bob Wilson",
                LocalTime.of(18, 30),
                LocalTime.of(22, 0),
                Arrays.asList(bob, john, jane, alice),
                new ArrayList<>(),
                "The Rooftop Bar");
        birthdayBash = eventRepository.save(birthdayBash);

        // Add pictures to events
        pictureRepository.save(new Picture(0, "https://images.unsplash.com/photo-1530587191325-3db32d826c18",
                summerPicnic, "summer,picnic,friends,outdoor"));
        pictureRepository.save(new Picture(0, "https://images.unsplash.com/photo-1555939594-58d7cb561ad1", summerPicnic,
                "food,healthy,fresh"));
        pictureRepository.save(new Picture(0, "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
                summerPicnic, "nature,park,trees"));

        pictureRepository.save(new Picture(0, "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1",
                beachParty, "beach,volleyball,sports,fun"));
        pictureRepository.save(new Picture(0, "https://images.unsplash.com/photo-1519046904884-53103b34b206",
                beachParty, "beach,ocean,sunset"));
        pictureRepository.save(new Picture(0, "https://images.unsplash.com/photo-1502933691298-84fc14542831",
                beachParty, "tournament,action,competition"));

        pictureRepository.save(new Picture(0, "https://images.unsplash.com/photo-1512389142860-9c449e58a543",
                christmasGala, "christmas,party,celebration,elegant"));
        pictureRepository.save(new Picture(0, "https://images.unsplash.com/photo-1482575832494-771f74bf6857",
                christmasGala, "decorations,lights,festive"));
        pictureRepository.save(new Picture(0, "https://images.unsplash.com/photo-1481627834876-b7833e8f5570",
                christmasGala, "dinner,gala,formal"));

        pictureRepository.save(new Picture(0, "https://images.unsplash.com/photo-1530103862676-de8c9debad1d",
                birthdayBash, "birthday,celebration,party,cake"));
        pictureRepository.save(new Picture(0, "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3",
                birthdayBash, "rooftop,nightlife,cityview"));
    }

}
