// src/main/java/com/example/backend/dto/InterestResponseDto.java
package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class InterestResponseDto {
    private Long userId;
    private List<String> interests;
}
