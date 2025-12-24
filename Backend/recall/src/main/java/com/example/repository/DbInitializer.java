package com.example.repository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.models.Event;
import com.example.models.Picture;
import com.example.models.User;

import jakarta.annotation.PostConstruct;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DbInitializer {

        private final UserRepository userRepository;
        private final EventRepository eventRepository;
        private final PictureRepository pictureRepository;
        private final PasswordEncoder passwordEncoder;

        public DbInitializer(UserRepository userRepository, EventRepository eventRepository,
                        PictureRepository pictureRepository, PasswordEncoder passwordEncoder) {
                this.userRepository = userRepository;
                this.eventRepository = eventRepository;
                this.pictureRepository = pictureRepository;
                this.passwordEncoder = passwordEncoder;
        }

        public void clearAll() {
                pictureRepository.deleteAll();
                eventRepository.deleteAll();
                userRepository.deleteAll();
        }

        @PostConstruct
        public void init() {
                clearAll();

                // Create Users
                User admin = userRepository.save(
                                new User("admin123", "admin@ucll.be", "Admin", "User",
                                                passwordEncoder.encode("password")));

                User john = userRepository.save(
                                new User("johndoe", "john.doe@email.com", "John", "Doe",
                                                passwordEncoder.encode("password123")));

                User jane = userRepository.save(
                                new User("janesmith", "jane.smith@email.com", "Jane", "Smith",
                                                passwordEncoder.encode("password123")));

                User mike = userRepository.save(
                                new User("mikeross", "mike.ross@email.com", "Mike", "Ross",
                                                passwordEncoder.encode("password123")));

                User emily = userRepository.save(
                                new User("emilychen", "emily.chen@email.com", "Emily", "Chen",
                                                passwordEncoder.encode("password123")));

                User david = userRepository.save(
                                new User("davidlee", "david.lee@email.com", "David", "Lee",
                                                passwordEncoder.encode("password123")));

                // Create Events
                Event birthdayParty = new Event(
                                "Sarah's Birthday Bash",
                                LocalDate.now().plusDays(1),
                                "Sarah Johnson",
                                LocalTime.of(18, 0),
                                LocalTime.of(23, 30),
                                "123 Party Avenue, New York");
                birthdayParty.setUsernames(Arrays.asList(john.getUsername(), jane.getUsername(), mike.getUsername(),
                                emily.getUsername()));
                birthdayParty = eventRepository.save(birthdayParty);

                Event graduation = new Event(
                                "Class of 2025 Graduation",
                                LocalDate.now().plusMonths(6),
                                "UCLL University",
                                LocalTime.of(10, 0),
                                LocalTime.of(14, 0),
                                "University Campus, Main Hall");
                graduation.setUsernames(Arrays.asList(admin.getUsername(), john.getUsername(), jane.getUsername(),
                                david.getUsername()));
                graduation = eventRepository.save(graduation);

                Event wedding = new Event(
                                "Emma & James Wedding",
                                LocalDate.now().plusMonths(8),
                                "Emma Davis",
                                LocalTime.of(15, 0),
                                LocalTime.of(23, 0),
                                "Sunset Garden, California");
                wedding.setUsernames(Arrays.asList(jane.getUsername(), mike.getUsername(), emily.getUsername(),
                                david.getUsername()));
                wedding = eventRepository.save(wedding);

                Event concert = new Event(
                                "Summer Music Festival",
                                LocalDate.now().plusWeeks(2),
                                "Live Events Co.",
                                LocalTime.of(17, 0),
                                LocalTime.of(22, 0),
                                "Central Park, Main Stage");
                concert.setUsernames(Arrays.asList(john.getUsername(), mike.getUsername(), emily.getUsername()));
                concert = eventRepository.save(concert);

                Event conference = new Event(
                                "Tech Innovation Summit 2026",
                                LocalDate.now().plusMonths(11),
                                "Tech Leaders Network",
                                LocalTime.of(9, 0),
                                LocalTime.of(18, 0),
                                "Convention Center, Downtown");
                conference.setUsernames(Arrays.asList(admin.getUsername(), john.getUsername(), david.getUsername()));
                conference = eventRepository.save(conference);

                Event reunion = new Event(
                                "High School Reunion",
                                LocalDate.now().plusYears(1).plusMonths(3),
                                "Class Committee",
                                LocalTime.of(19, 0),
                                LocalTime.of(23, 59),
                                "Grand Hotel, Ballroom");
                reunion.setUsernames(Arrays.asList(jane.getUsername(), mike.getUsername(), emily.getUsername(),
                                david.getUsername()));
                reunion = eventRepository.save(reunion);

                // Create Pictures for Birthday Party
                birthdayParty.setPictures(Arrays.asList(
                                new Picture("https://images.unsplash.com/photo-1530103862676-de8c9debad1d",
                                                "birthday,celebration,party,fun"),
                                new Picture("https://images.unsplash.com/photo-1464349095431-e9a21285b5f3",
                                                "birthday,cake,candles,sweet"),
                                new Picture("https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
                                                "party,music,concert,celebration")));
                eventRepository.save(birthdayParty);

                // Create Pictures for Graduation
                graduation.setPictures(Arrays.asList(
                                new Picture("https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
                                                "graduation,university,education,success"),
                                new Picture("https://images.unsplash.com/photo-1566737236500-c8ac43014a67",
                                                "graduation,ceremony,achievement,graduate"),
                                new Picture("https://images.unsplash.com/photo-1541339907198-e08756dedf3f",
                                                "graduation,celebration,diploma,proud")));
                eventRepository.save(graduation);

                // Create Pictures for Wedding
                wedding.setPictures(Arrays.asList(
                                new Picture("https://images.unsplash.com/photo-1519741497674-611481863552",
                                                "wedding,marriage,couple,love"),
                                new Picture("https://images.unsplash.com/photo-1606800052052-a08af7148866",
                                                "wedding,bride,groom,ceremony"),
                                new Picture("https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6",
                                                "wedding,flowers,decoration,beautiful"),
                                new Picture("https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
                                                "wedding,reception,party,celebration")));
                eventRepository.save(wedding);

                // Create Pictures for Concert
                concert.setPictures(Arrays.asList(
                                new Picture("https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
                                                "concert,music,festival,crowd"),
                                new Picture("https://images.unsplash.com/photo-1501281668745-f7f57925c3b4",
                                                "concert,stage,performance,lights"),
                                new Picture("https://images.unsplash.com/photo-1459749411175-04bf5292ceea",
                                                "music,festival,summer,outdoor")));
                eventRepository.save(concert);

                // Create Pictures for Conference
                conference.setPictures(Arrays.asList(
                                new Picture("https://images.unsplash.com/photo-1540575467063-178a50c2df87",
                                                "conference,technology,presentation,business"),
                                new Picture("https://images.unsplash.com/photo-1591115765373-5207764f72e7",
                                                "conference,networking,professional,tech"),
                                new Picture("https://images.unsplash.com/photo-1475721027785-f74eccf877e2",
                                                "conference,speaker,seminar,innovation")));
                eventRepository.save(conference);

                // Create Pictures for Reunion
                reunion.setPictures(Arrays.asList(
                                new Picture("https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
                                                "reunion,friends,group,memories"),
                                new Picture("https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
                                                "reunion,party,celebration,together"),
                                new Picture("https://images.unsplash.com/photo-1528605248644-14dd04022da1",
                                                "reunion,dinner,gathering,fun")));
                eventRepository.save(reunion);

                System.out.println("✅ Database initialized with dummy data!");
                System.out.println("📊 Created: 6 users, 6 events, 21 pictures");
        }

}
