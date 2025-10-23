package com.example.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CodeRequest {
    @NotBlank(message = "email is required")
    @Email(message = "Email should be valid")
    String email;

    private int code;
}
