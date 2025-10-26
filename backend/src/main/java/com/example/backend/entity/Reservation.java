package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "reservation")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "type") // 타입 구분용 컬럼
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder // 자식 클래스에서 빌더를 상속받도록 설정
public abstract class Reservation { // 추상 클래스로 선언

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_detail_id", nullable = false)
    @JsonBackReference
    private PlanDetail planDetail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_id")
    private Place place;

    @Column(name = "type", insertable = false, updatable = false)
    private String type;

    private String name;
    private String reservationNo;
    private String memo;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
