package com.example.backend.service;

import com.example.backend.dto.PlaceRequest;
import com.example.backend.entity.Place;
import com.example.backend.repository.PlaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlaceService {

    private final PlaceRepository placeRepository;

    public Place createPlace(PlaceRequest request) {
        Place place = Place.builder()
                .placeName(request.getPlcaeName())
                .address(request.getAddress())
                .classification(request.getClassification())
                .call(request.getCall())
                .build();
        return placeRepository.save(place);
    }

    public List<Place> getAllPlaces() {
        return placeRepository.findAll();
    }

    public Place getPlaceById(Long id) {
        return placeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 장소를 찾을 수 없습니다."));
    }

    public Place updatePlace(Long id, PlaceRequest request) {
        Place place = getPlaceById(id);
        place.setPlaceName(request.getPlcaeName());
        place.setAddress(request.getAddress());
        place.setClassification(request.getClassification());
        place.setCall(request.getCall());
        return placeRepository.save(place);
    }

    public void deletePlace(Long id) {
        Place place = getPlaceById(id);
        placeRepository.delete(place);
    }
}
