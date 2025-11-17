package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.models.Picture;

@Repository
public interface PictureRepository extends JpaRepository<Picture, Long> {
    
}
