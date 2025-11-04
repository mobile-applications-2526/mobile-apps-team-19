package com.example.models;

import java.util.List;
import java.time.LocalDate;
import java.time.LocalTime;

public class Event {
    private String name;
    private LocalDate date;
    private String hostName;
    private LocalTime startTime;
    private LocalTime endTime;
    private List<User> users;
    private List<Picture> pictures;
    private String location;


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
