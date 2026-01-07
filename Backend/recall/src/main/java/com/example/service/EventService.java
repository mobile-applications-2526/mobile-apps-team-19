package com.example.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.models.Event;
import com.example.models.Picture;
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

    public void createEvent(Event eventdata) {
        Event newEvent = new Event(eventdata.getName(), eventdata.getDate(), eventdata.getHostName(),
                eventdata.getStartTime(), eventdata.getEndTime(), eventdata.getLocation());
        eventRepository.save(newEvent);
    }

    public void addPictureToEvent(String eventName, String pictureUrl) {
        Event event = eventRepository.findByName(eventName);
        Picture picture = new Picture(pictureUrl, "");
        if (event != null) {
            event.getPictures().add(picture);
            eventRepository.save(event);
        }
    }

    public void addCurrentUserToEvent(String eventName, String username) {
        Event event = eventRepository.findByName(eventName);
        if (event != null && !event.getUsernames().contains(username)) {
            event.getUsernames().add(username);
            eventRepository.save(event);
        }
    }

}
