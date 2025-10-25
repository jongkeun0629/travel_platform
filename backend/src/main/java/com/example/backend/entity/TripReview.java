package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "trip_review")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trip_review_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private Plan plan;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private int rating;

    @Column(nullable = false)
    private String region;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
