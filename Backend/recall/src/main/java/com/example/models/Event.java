package com.example.models;

import java.util.List;
import java.time.LocalDate;
import java.time.LocalTime;

public class Event {
    private String name;
    private LocalDate date;
    private User host;
    private LocalTime starTime;
    private LocalTime endTime;
    private List<User> users;
    private List<Picture> pictures;

    
}
