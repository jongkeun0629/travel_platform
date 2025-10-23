package com.example.backend.dto;

import com.example.backend.entity.Place;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PlaceResponse {
    private Long id;
    private String placeName;
    private String address;
    private String classification;
    private String call;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PlaceResponse fromEntity(Place place) {
        return PlaceResponse.builder()
                .id(place.getId())
                .placeName(place.getPlaceName())
                .address(place.getAddress())
                .classification(place.getClassification())
                .call(place.getCall())
                .build();
    }
}
