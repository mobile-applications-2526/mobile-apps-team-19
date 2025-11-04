package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.models.Pictures;

@Repository
public interface PicturesRepository extends JpaRepository<Pictures, Long> {
    
}
