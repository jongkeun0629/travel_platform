package com.example.backend.controller;

import com.example.backend.dto.PlaceRequest;
import com.example.backend.dto.PlaceResponse;
import com.example.backend.entity.Place;
import com.example.backend.service.PlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/places")
@RequiredArgsConstructor
public class PlaceController {

    private final PlaceService placeService;

    @PostMapping
    public ResponseEntity<PlaceResponse> createPlace(@RequestBody PlaceRequest request) {
        Place created = placeService.createPlace(request);
        return ResponseEntity.ok(PlaceResponse.fromEntity(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlaceResponse> updatePlace(@PathVariable Long id, @RequestBody PlaceRequest request) {
        Place updated = placeService.updatePlace(id, request);
        return ResponseEntity.ok(PlaceResponse.fromEntity(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlace(@PathVariable Long id) {
        placeService.deletePlace(id);
        return ResponseEntity.noContent().build();
    }
}
