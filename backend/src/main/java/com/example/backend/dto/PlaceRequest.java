package com.example.backend.dto;

import lombok.Data;

@Data
public class PlaceRequest {
    private String plcaeName;
    private String address;
    private String classification;
    private String call;
}
