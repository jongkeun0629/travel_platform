package com.example.backend.controller;

import com.example.backend.dto.ItemRequest;
import com.example.backend.entity.Item;
import com.example.backend.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/plans/{planId}/items")
public class ItemController {
    private final ItemService itemService;

    @PostMapping("/add")
    public ResponseEntity<String> addItem(@PathVariable Long planId, @RequestBody ItemRequest request){
        itemService.add(planId,request);
        return ResponseEntity.status(201).body("Item added successfully.");
    }
//    @DeleteMapping()
//    public ResponseEntity<String> deleteItem(@RequestBody Item item){
//        itemService.delete();
//    }
}
