package com.example.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

import com.example.models.Event;
import com.example.service.EventService;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/events")
public class EventController {
    final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    @PostMapping()
    public void createEvent(@RequestBody Event entityData) {

        eventService.createEvent(entityData);

    }

    @PostMapping("/{eventId}/add-picture")
    public void addPictureToEvent(@PathVariable Long eventId, @RequestBody String pictureUrl) {
        eventService.addPictureToEvent(eventId, pictureUrl);
    }

    @PostMapping("/{eventName}/join")
    public void addCurrentUserToEvent(@PathVariable String eventName, @RequestBody String username) {
        eventService.addCurrentUserToEvent(eventName, username);
    }

}
