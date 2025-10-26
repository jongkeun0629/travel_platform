// src/main/java/com/example/backend/dto/InterestRequestDto.java
package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class InterestRequestDto {
    private List<String> interestNames;
}
