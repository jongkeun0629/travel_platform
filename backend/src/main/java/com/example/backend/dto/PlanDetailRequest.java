package com.example.backend.dto;

import lombok.Data;

@Data
public class PlanDetailRequest {
    private Long planId;
    private Long placeId;
    private PlaceRequest place;
    private String tripday;
    private String reserveInfo;
    private String placeType;
    private String details;

    //장소 정보
//    private PlaceRequest place;
}
