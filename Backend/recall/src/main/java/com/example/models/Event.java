package com.example.models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.JoinTable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.CascadeType;

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

    @ManyToMany
    @JoinTable(name = "event_users", joinColumns = @JoinColumn(name = "event_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    @JsonIgnore
    private List<User> users;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Picture> pictures;

    private String location;

    protected Event() {
    }

    public Event(String name, LocalDate date, String hostName, LocalTime startTime, LocalTime endTime, List<User> users,
            List<Picture> pictures, String location) {
        setDate(date);
        setEndTime(endTime);
        setStarTime(startTime);
        setName(name);
        setHostName(hostName);
        setUsers(users);
        setPictures(pictures);
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

    public void setStarTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public void setUsers(List<User> users) {
        this.users = users;
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

    public List<User> getUsers() {
        return users;
    }

    public List<Picture> getPictures() {
        return pictures;
    }

    public String getLocation() {
        return location;
    }

}
