package com.example.service;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import com.example.models.Picture;
import com.example.repository.PictureRepository;

@Service
public class PictureService {
    final PictureRepository picturesRepository;

    public PictureService(PictureRepository picturesRepository) {
        this.picturesRepository = picturesRepository;
    }

    public List<Picture> getAllPictures() {
        return picturesRepository.findAll();
    }

    public Picture getPictureById(Long id) {
        return picturesRepository.findById(id).orElse(null);
    }

    public List<Picture> getPicturesByHashtag(String hashtag) {
        List<Picture> result = new ArrayList<>();
        List<Picture> pictures = picturesRepository.findAll();
        for (Picture pic : pictures) {
            if (pic.getHashtags().contains(hashtag)) {
                result.add(pic);
            }
        }
        return result;

    }



    
}
