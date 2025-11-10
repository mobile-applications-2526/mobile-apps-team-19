package com.example.service;
import java.util.List;
import org.springframework.stereotype.Service;
import com.example.models.Pictures;
import com.example.repository.PicturesRepository;

@Service
public class PictureService {
    final PicturesRepository picturesRepository;

    public PictureService(PicturesRepository picturesRepository) {
        this.picturesRepository = picturesRepository;
    }

    public List<Pictures> getAllPictures() {
        return picturesRepository.findAll();
    }

    public Pictures getPictureById(Long id) {
        return picturesRepository.findById(id).orElse(null);
    }

    public Pictures getPictureByHashtag(String hashtag) {
        List<Pictures> allPictures = picturesRepository.findAll();
        for (Pictures picture : allPictures) {
            List<String> hashtagsList = picture.getHashtagsList();
            if (hashtagsList.contains(hashtag)) {
                return picture;
            }
        }
        return null;
    }



    
}
