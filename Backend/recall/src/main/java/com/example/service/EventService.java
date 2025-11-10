package com.example.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.models.Event;
import com.example.repository.EventRepository;

@Service
public class EventService {

    final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }


    public Event getEventById(Long id) {
        return eventRepository.findById(id).orElse(null);
         
    }

}
