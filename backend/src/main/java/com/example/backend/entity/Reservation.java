package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "reservation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_detail_id", nullable = false)
    private PlanDetail planDetail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_id")
    private Place place;

    @Column(nullable = false)
    private String type;       // 교통, 식당, 숙소 타입

    private String name;       // 교통편명/ 식당명/ 숙소명

    //교통용
    private String startLocation;
    private String endLocation;
    private String seat;

    private String address;
    private String call;
    private String reservationNo;
    private String memo;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
