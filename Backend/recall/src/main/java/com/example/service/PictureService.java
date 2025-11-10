package com.example.service;
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



    
}
