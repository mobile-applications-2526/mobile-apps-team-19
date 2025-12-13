package com.example.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.models.Picture;
import com.example.service.PictureService;

@RestController
@RequestMapping("/pictures")
public class PictureController {
    
    private final PictureService pictureService;

    public PictureController(PictureService pictureService) {
        this.pictureService = pictureService;
    }

    // alle fotos ophalen
    @GetMapping
    public List<Picture> getAllPictures() {
        return pictureService.getAllPictures();
    }

    // geeft fotos van een bepaald event terug
    @GetMapping("/event/{eventId}")
    public List<Picture> getPicturesByEvent(@PathVariable Long eventId) {
        return pictureService.getPicturesByEventId(eventId);
    }

    // voor als je later een web versie maakt ofzo
    @PostMapping("/upload")
    public ResponseEntity<Picture> uploadPicture(
            @RequestParam("file") MultipartFile file,
            @RequestParam("eventId") Long eventId,
            @RequestParam(value = "hashtags", required = false) String hashtags) {
        
        try {
            Picture picture = pictureService.uploadPicture(file, eventId, hashtags);
            return ResponseEntity.status(HttpStatus.CREATED).body(picture);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // dit gebruik ik voor de mobile app, fotos komen binnen als base64
    @PostMapping("/upload-base64")
    public ResponseEntity<Picture> uploadPictureBase64(
            @RequestBody PictureUploadRequest request) {
        
        try {
            Picture picture = pictureService.uploadPictureBase64(
                request.getBase64Data(), 
                request.getEventId(), 
                request.getHashtags()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(picture);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // request obejct met foto data
    public static class PictureUploadRequest {
        private String base64Data;
        private Long eventId;
        private String hashtags;

        public String getBase64Data() {
            return base64Data;
        }

        public void setBase64Data(String base64Data) {
            this.base64Data = base64Data;
        }

        public Long getEventId() {
            return eventId;
        }

        public void setEventId(Long eventId) {
            this.eventId = eventId;
        }

        public String getHashtags() {
            return hashtags;
        }

        public void setHashtags(String hashtags) {
            this.hashtags = hashtags;
        }
    }
}
