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
    public ItemResponse add(Long planId, ItemRequest request){
        itemRepository.findByPlan_IdAndName(planId, request.getName()).ifPresent(item -> {throw new IllegalArgumentException("동일한 항목이 존재합니다.");});
        Item newItem = Item.builder()
                        .name(request.getName())
                .plan(planRepository.findById(planId).get())
                                .build();
        Item savedItem = itemRepository.save(newItem);  // 반환값 저장
        return ItemResponse.fromEntity(savedItem);  // ItemResponse 반환
    }

    @Transactional
    public void delete(Long planId, Long id){
        if(itemRepository.findById(id).get().getPlan().getId().equals(planId)) {
            itemRepository.deleteById(id);
        }
    }
    @Transactional
    public List<ItemResponse> get(Long planId) {
        List<Item> items = itemRepository.findAllByPlan_Id(planId);

        return items.stream()
                .map(ItemResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ItemResponse toggleCheck(Long planId, Long id){
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("아이템을 찾을 수 없습니다."));

        if(item.getPlan().getId().equals(planId)) {
            item.setChecked(!item.isChecked()); // ✅ 토글 처리
            itemRepository.save(item);
            return ItemResponse.fromEntity(item); // ✅ 업데이트된 아이템 반환
        }

        throw new IllegalArgumentException("권한이 없습니다.");
    }

}
