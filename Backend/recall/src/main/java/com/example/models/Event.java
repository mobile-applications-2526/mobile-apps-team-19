package com.example.models;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Event name cannot be blank")
    private String name;
    @FutureOrPresent(message = "Event date cannot be in the past")
    @NotNull(message = "Event date cannot be null")
    private LocalDate date;
    @NotBlank(message = "Host name cannot be blank")
    private String hostName;
    @NotNull(message = "Event start time cannot be null")
    private LocalTime startTime;
    @NotNull(message = "Event end time cannot be null")
    private LocalTime endTime;

    @ElementCollection
    @CollectionTable(name = "event_usernames", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "username")
    private List<String> usernames;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "event_id", nullable = false)
    private List<Picture> pictures;

    private String location;

    protected Event() {
    }

    public Event(String name, LocalDate date, String hostName, LocalTime startTime, LocalTime endTime,
            String location) {
        setDate(date);
        setEndTime(endTime);
        setStartTime(startTime);
        setName(name);
        setHostName(hostName);
        this.pictures = List.of();
        this.usernames = List.of();
        setLocation(location);

    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public void setHostName(String hostName) {
        this.hostName = hostName;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public void setUsernames(List<String> usernames) {
        this.usernames = usernames;
    }

    public void setPictures(List<Picture> pictures) {
        this.pictures = pictures;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getName() {
        return name;
    }

    public LocalDate getDate() {
        return date;
    }

    public String getHostName() {
        return hostName;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public List<String> getUsernames() {
        return usernames;
    }

    public List<Picture> getPictures() {
        return pictures;
    }

    public String getLocation() {
        return location;
    }

}
