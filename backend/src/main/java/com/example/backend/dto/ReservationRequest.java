package com.example.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder // 빌더 패턴을 상속받을 수 있도록 설정
@NoArgsConstructor // Lombok을 위한 기본 생성자
public class ReservationRequest {
    private Long planDetailId;
    private String type;
    private PlaceRequest place;
}
