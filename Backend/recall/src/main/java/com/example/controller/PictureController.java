package com.example.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.models.Event;
import com.example.models.Picture;
import com.example.repository.EventRepository;
import com.example.service.PictureService;
import com.example.service.SupabaseStorageService;

@RestController
@RequestMapping("/pictures")
public class PictureController {

    final PictureService pictureService;
    final SupabaseStorageService supabaseStorageService;
    final EventRepository eventRepository;

    public PictureController(PictureService pictureService, SupabaseStorageService supabaseStorageService, EventRepository eventRepository) {
        this.pictureService = pictureService;
        this.supabaseStorageService = supabaseStorageService;
        this.eventRepository = eventRepository;
    }

    @GetMapping()
    public List<Picture> getAllPictures() {
        return pictureService.getAllPictures();
    }

    @GetMapping("/{id}")
    public Picture getPictureById(@PathVariable Long id) {
        return pictureService.getPictureById(id);
    }

    @GetMapping("/hashtag/{hashtag}")
    public List<Picture> getPicturesByHashtag(@PathVariable String hashtag) {
        return pictureService.getPicturesByHashtag(hashtag);
    }

    @GetMapping("/event/{eventId}")
    public List<Picture> getPicturesByEvent(@PathVariable Long eventId) {
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event == null) {
            return List.of();
        }
        return event.getPictures();
    }

    @PostMapping("/upload")
    public ResponseEntity<Picture> uploadPicture(
            @RequestParam("file") MultipartFile file,
            @RequestParam("eventId") Long eventId,
            @RequestParam(value = "hashtags", required = false, defaultValue = "") String hashtags) {
        try {
            // Validate event exists
            Event event = eventRepository.findById(eventId)
                    .orElseThrow(() -> new IllegalArgumentException("Event not found"));

            // Upload file to Supabase Storage
            String fileUrl = supabaseStorageService.uploadFile(file, eventId);

            // Create and save Picture
            Picture picture = new Picture(fileUrl, hashtags, event);
            Picture savedPicture = pictureService.savePicture(picture);

            return ResponseEntity.status(HttpStatus.CREATED).body(savedPicture);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}

