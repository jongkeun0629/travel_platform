//package com.example.backend.entity;
//
//
//import jakarta.persistence.*;
//import lombok.Builder;
//import lombok.Data;
//
//import java.util.List;
//
//@Entity
//@Table(name = "checklists")
//@Data
//public class Checklist {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "check_id")
//    private Long checkId;
//
//    @OneToOne
//    @JoinColumn(name = "plan_id")
//    private Plan plan;
//
//    @OneToMany(mappedBy = "checklist", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//    private List<Item> items;
//}
