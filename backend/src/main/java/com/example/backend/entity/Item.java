package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

@Entity
@Data
@Builder
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    @Column(name = "is_checked", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean checked;
//    @ManyToOne
//    @JoinColumn(name = "checklist_id")
//    private Checklist checklist;
    @ManyToOne
    @JoinColumn(name = "plan_id")
    private Plan plan;
}

