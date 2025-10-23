package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    @Column(name = "is_checked", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean checked;

    @ManyToOne
    @JoinColumn(name = "plan_id")
    private Plan plan;
}

