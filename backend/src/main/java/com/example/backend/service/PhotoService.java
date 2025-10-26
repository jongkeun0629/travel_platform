package com.example.backend.service;

import com.example.backend.entity.Photo;
import com.example.backend.entity.TripReview;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.PhotoRepository;
import com.example.backend.repository.TripReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PhotoService {

    private final TripReviewRepository tripReviewRepository;
    private final PhotoRepository photoRepository;

    @Transactional
    public void savePhotoToReview(Long reviewId, String imageUrl) {
        TripReview tripReview = tripReviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("TripReview not found with ID: " + reviewId));

        Photo newPhoto = new Photo();
        newPhoto.setImageUrl(imageUrl);

        newPhoto.setTripreview(tripReview);//부모연결

        tripReview.getPhotoList().add(newPhoto);//자식연결

        photoRepository.save(newPhoto);
    }
}