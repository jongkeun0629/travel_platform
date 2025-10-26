package com.example.backend.service;

import com.example.backend.dto.InterestRequestDto;
import com.example.backend.dto.InterestResponseDto;
import com.example.backend.entity.Interest;
import com.example.backend.entity.User;
import com.example.backend.repository.InterestRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserInterestService {

    private final UserRepository userRepository;
    private final InterestRepository interestRepository;

    @Transactional
    public InterestResponseDto updateUserInterests(Long userId, InterestRequestDto requestDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        List<Interest> interests = new ArrayList<>();
        for (String name : requestDto.getInterestNames()) {
            Interest interest = interestRepository.findByName(name)
                    .orElseGet(() -> interestRepository.save(Interest.builder().name(name).build())); // 없으면 새로 생성
            interests.add(interest);
        }

        user.setInterests(interests);
        userRepository.save(user);

        return new InterestResponseDto(
                user.getId(),
                interests.stream().map(Interest::getName).collect(Collectors.toList())
        );
    }

    @Transactional(readOnly = true)
    public InterestResponseDto getUserInterests(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        List<String> interestNames = user.getInterests()
                .stream()
                .map(Interest::getName)
                .collect(Collectors.toList());

        return new InterestResponseDto(user.getId(), interestNames);
    }

    @Transactional
    public InterestResponseDto removeUserInterest(Long userId, String interestName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        Interest interest = interestRepository.findByName(interestName)
                .orElseThrow(() -> new IllegalArgumentException("해당 관심사를 찾을 수 없습니다."));

        user.getInterests().remove(interest);
        userRepository.save(user);

        List<String> remaining = user.getInterests()
                .stream().map(Interest::getName).collect(Collectors.toList());

        return new InterestResponseDto(user.getId(), remaining);
    }

}
