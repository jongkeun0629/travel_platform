package com.example.backend.service;

import com.example.backend.dto.StatsDto;
import com.example.backend.dto.UserEditResponseRequest;
import com.example.backend.entity.Interest;
import com.example.backend.entity.User;
import com.example.backend.repository.InterestRepository;
import com.example.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final InterestRepository interestRepository;
    private final PlanService planService;
    private final TripReviewService tripReviewService;

    @Transactional
    public UserEditResponseRequest getUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        List<String> interestNames = user.getInterests().stream()
                .map(Interest::getName)
                .collect(Collectors.toList());

        String birthDateString = null;
        if (user.getBirth() != null) {
            birthDateString = user.getBirth().toString();
        }

        Long planCount = planService.getUserPlanCount(userId);
        Long tripReviewCount = tripReviewService.getUserTripReviewCount(userId);
        StatsDto statsDto = StatsDto.builder()
                .plans(planCount)
                .reviews(tripReviewCount)
                .build();

        return UserEditResponseRequest.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .introduction(user.getIntroduction())
                .profileImageUrl(user.getProfileImageUrl())
                .interests(interestNames)
                .birthdate(birthDateString)
                .stats(statsDto)
                .build();
    }

    @Transactional
    public UserEditResponseRequest updateUser(Long userId, UserEditResponseRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        boolean usernameChanged = !user.getUsername().equals(request.getUsername());

        user.setUsername(request.getUsername());
        user.setIntroduction(request.getIntroduction());

        if (request.getInterests() != null) {
            List<Interest> newInterests = interestRepository.findByNameIn(request.getInterests());
            user.getInterests().clear();
            user.getInterests().addAll(newInterests);
        }

        User updatedUser = userRepository.save(user);

        String birthDateString = null;
        if (updatedUser.getBirth() != null) {
            birthDateString = updatedUser.getBirth().toString();
        }

        Long planCount = planService.getUserPlanCount(userId);
        Long tripReviewCount = tripReviewService.getUserTripReviewCount(userId);
        StatsDto statsDto = StatsDto.builder()
                .plans(planCount)
                .reviews(tripReviewCount) // 리뷰 개수 기능
                .build();

        UserEditResponseRequest response = UserEditResponseRequest.builder()
                .email(request.getEmail())
                .username(user.getUsername())
                .introduction(user.getIntroduction())
                .interests(request.getInterests())
                .birthdate(birthDateString)
                .stats(statsDto)
                .build();

        if (usernameChanged) {
            String newAccessToken = jwtService.generateToken(updatedUser);
            String newRefreshToken = jwtService.generateRefreshToken(updatedUser);
            response.setAccessToken(newAccessToken);
            response.setRefreshToken(newRefreshToken);
        }

        return response;
    }
}
