package com.example.service;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.models.Event;
import com.example.models.Picture;
import com.example.repository.EventRepository;
import com.example.repository.PictureRepository;

@Service
public class PictureService {
    final PictureRepository picturesRepository;
    final EventRepository eventRepository;
    
    private final String UPLOAD_DIR = "uploads/pictures/";

    public PictureService(PictureRepository picturesRepository, EventRepository eventRepository) {
        this.picturesRepository = picturesRepository;
        this.eventRepository = eventRepository;
        
        // map aanmaken voor de fotos
        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public List<Picture> getAllPictures() {
        return picturesRepository.findAll();
    }

    public Picture getPictureById(Long id) {
        return picturesRepository.findById(id).orElse(null);
    }
    
    public List<Picture> getPicturesByEventId(Long eventId) {
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event == null) {
            return List.of();
        }
        return event.getPictures();
    }

    public Picture getPictureByHashtag(String hashtag) {
        List<Picture> allPictures = picturesRepository.findAll();
        for (Picture picture : allPictures) {
            List<String> hashtagsList = picture.getHashtagsList();
            if (hashtagsList.contains(hashtag)) {
                return picture;
            }
        }
        return null;
    }
    
    public Picture uploadPicture(MultipartFile file, Long eventId, String hashtags) throws IOException {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        
        // unieke naam generen met dieje UUID
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null ? 
            originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
        String filename = UUID.randomUUID().toString() + extension;
        
        // bestand opslaan
        Path filePath = Paths.get(UPLOAD_DIR + filename);
        Files.write(filePath, file.getBytes());
        
        // picture aanmaken en opslaan in db
        Picture picture = new Picture(0, "/uploads/pictures/" + filename, event, hashtags);
        return picturesRepository.save(picture);
    }
    
    public Picture uploadPictureBase64(String base64Data, Long eventId, String hashtags) throws IOException {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        
        // prefix eraf halen als die er is
        String base64Image = base64Data;
        if (base64Data.contains(",")) {
            base64Image = base64Data.split(",")[1];
        }
        
        // decode de base64 string naar bytes
        byte[] imageBytes = Base64.getDecoder().decode(base64Image);
        
        // unieke naam maken
        String filename = UUID.randomUUID().toString() + ".jpg";
        
        // bytes naar file schrijven
        Path filePath = Paths.get(UPLOAD_DIR + filename);
        Files.write(filePath, imageBytes);
        
        // opslaan in database me de URL
        Picture picture = new Picture(0, "/uploads/pictures/" + filename, event, hashtags);
        return picturesRepository.save(picture);
    }
}
