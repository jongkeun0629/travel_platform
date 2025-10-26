package com.example.backend.repository;

import com.example.backend.entity.Interest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InterestRepository extends JpaRepository<Interest, Long> {
    Optional<Interest> findByName(String name);

    List<Interest> findByNameIn(List<String> names);
}