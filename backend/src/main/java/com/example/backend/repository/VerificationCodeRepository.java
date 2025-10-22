package com.example.backend.repository;

import com.example.backend.entity.EmailCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VerificationCodeRepository extends JpaRepository<EmailCode, Long> {
    Optional<EmailCode> findByEmail(String email);
}
