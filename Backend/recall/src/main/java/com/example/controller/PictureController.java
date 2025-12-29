package com.example.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.models.Picture;
import com.example.service.PictureService;

@RestController
@RequestMapping("/pictures")
public class PictureController {

    final PictureService pictureService;

    public PictureController(PictureService pictureService) {
        this.pictureService = pictureService;
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
}
