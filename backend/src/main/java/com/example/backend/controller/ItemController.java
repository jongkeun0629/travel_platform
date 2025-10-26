package com.example.backend.controller;

import com.example.backend.dto.ItemRequest;
import com.example.backend.dto.ItemResponse;
import com.example.backend.entity.Item;
import com.example.backend.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/plans/{planId}/items")
public class ItemController {
    private final ItemService itemService;

    @PostMapping("/add")
    public ResponseEntity<ItemResponse> addItem(@PathVariable Long planId, @RequestBody ItemRequest request){
        ItemResponse createdItem = itemService.add(planId,request);
        return ResponseEntity.status(201).body(createdItem);  // ItemResponse 반환
    }
    @DeleteMapping("/{itemId}")
    public ResponseEntity<String> deleteItem(@PathVariable Long planId, @PathVariable Long itemId){
        itemService.delete(planId, itemId);

        return ResponseEntity.status(200).body("Item deleted successfully.");
    }
    @GetMapping()
    public ResponseEntity<List<ItemResponse>> getItems(@PathVariable Long planId){

        List<ItemResponse> responseList = itemService.get(planId);

        return ResponseEntity.ok(responseList);
    }
    @PatchMapping("/{itemId}")
    public ResponseEntity<ItemResponse> toggleCheck(@PathVariable Long planId, @PathVariable Long itemId){
        ItemResponse itemResponse = itemService.toggleCheck(planId, itemId);
        return ResponseEntity.ok(itemResponse);
    }
}
