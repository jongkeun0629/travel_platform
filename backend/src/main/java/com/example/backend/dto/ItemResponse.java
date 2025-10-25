package com.example.backend.dto;

import com.example.backend.entity.Item;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemResponse {
    private Long id;
    private String name;
    private boolean checked;
    private Long planId;


    public static ItemResponse fromEntity(Item item) {
        Long planId = item.getPlan() != null ? item.getPlan().getId() : null;

        return ItemResponse.builder()
                .id(item.getId())
                .name(item.getName())
                .checked(item.isChecked())
                .planId(planId)
                .build();
    }
}
