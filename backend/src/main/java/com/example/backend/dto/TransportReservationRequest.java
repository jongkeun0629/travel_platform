package com.example.backend.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true) // 부모 클래스의 필드까지 포함하여 equals/hashCode 생성
@Data
@SuperBuilder
@NoArgsConstructor
public class TransportReservationRequest extends ReservationRequest {
    private String name;
    private String startLocation;
    private String endLocation;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String seat;
    private String reservationNo;
    private String memo;
}
