package com.example.backend.repository;

import com.example.backend.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    Optional<Item> findByPlanPlanIdAndName(Long planId, String name);
    List<Item> findAllByPlanPlanId(long planId);
    Optional<Item> findById(Long id);
}
