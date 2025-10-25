package com.example.backend.dto;

import com.example.backend.entity.Place;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PlaceResponse {
    private Long id;
    private String kakaoPlaceId;
    private String placeName;
    private String address;
    private String call;
    private String classification;

    public static PlaceResponse fromEntity(Place place) {
        return PlaceResponse.builder()
                .id(place.getId())
                .kakaoPlaceId(place.getKakaoPlaceId())
                .placeName(place.getPlaceName())
                .address(place.getAddress())
                .call(place.getCall())
                .classification(place.getClassification())
                .build();
    }
}
