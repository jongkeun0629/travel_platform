package com.example.backend.service;

import com.example.backend.dto.ItemRequest;
import com.example.backend.dto.ItemResponse;
import com.example.backend.entity.Item;
import com.example.backend.entity.Plan;
import com.example.backend.repository.ItemRepository;
import com.example.backend.repository.PlanRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    public void InitialItem(Plan plan){//초기 아이템 설정
        List<Item> initialItems = BASE_ITEMS.stream()
                .map(itemName -> Item.builder()
                        .plan(plan)
                        .name(itemName).build())
                .collect(Collectors.toList());

        itemRepository.saveAll(initialItems);
    }

    @Transactional
    public void add(Long planId, ItemRequest request){
        itemRepository.findByPlanPlanIdAndName(planId, request.getName()).ifPresent(item -> {throw new IllegalArgumentException("동일한 항목이 존재합니다.");});//PlanPlanId인 이유- Plan객체내ㅐ에서 planId를 찾기 때문에
        Item newItem = Item.builder()
                        .name(request.getName())
                .plan(planRepository.findById(planId).get())
                                .build();
        itemRepository.save(newItem);
    }

    @Transactional
    public void delete(Long planId, Long id){
        if(itemRepository.findById(id).get().getPlan().getPlanId().equals(planId)) {
            itemRepository.deleteById(id);
        }
    }
    @Transactional
    public List<ItemResponse> get(Long planId) {
        List<Item> items = itemRepository.findAllByPlanPlanId(planId);

        return items.stream()
                .map(ItemResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void toggleCheck(Long planId, Long id){
        Item item = itemRepository.findById(id).get();
        if(item.getPlan().getPlanId().equals(planId)) {
            item.setChecked(true);
        }
        itemRepository.save(item);
    }

}
