package com.example.backend.service;

import com.example.backend.dto.ItemRequest;
import com.example.backend.entity.Item;
import com.example.backend.entity.Plan;
import com.example.backend.repository.ItemRepository;
import com.example.backend.repository.PlanRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemService {
    private final ItemRepository itemRepository;
    private final PlanRepository planRepository;


    private static final List<String> BASE_ITEMS = List.of(
            "교통편",
            "숙소",
            "세안도구",
            "의류",
            "충전기",
            "보조배터리",
            "상비약"
    );

    @Transactional
    public void InitialItem(Plan plan){
        List<Item> initialItems = BASE_ITEMS.stream()
                .map(itemName -> Item.builder()
                        .plan(plan)
                        .name(itemName).build())
                .collect(Collectors.toList());

        itemRepository.saveAll(initialItems);
    }

    @Transactional
    public void add(Long planId, ItemRequest request){
        Item newItem = Item.builder()
                        .name(request.getName())
                .plan(planRepository.findById(planId).get())
                                .build();
        itemRepository.save(newItem);
    }
}
