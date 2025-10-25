package com.example.backend.service;

import com.example.backend.entity.TripReview;
import com.example.backend.entity.TripReviewComment;
import com.example.backend.entity.TripReviewLike;
import com.example.backend.entity.User;
import com.example.backend.repository.TripReviewCommentRepository;
import com.example.backend.repository.TripReviewLikeRepository;
import com.example.backend.repository.TripReviewRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TripReviewInteractionService {

    private final TripReviewRepository tripReviewRepository;
    private final TripReviewCommentRepository commentRepository;
    private final TripReviewLikeRepository likeRepository;
    private final UserRepository userRepository;

    public TripReviewComment addComment(Long reviewId, Long userId, String content) {
        TripReview review = tripReviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("후기를 찾을 수 없습니다."));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        TripReviewComment comment = TripReviewComment.builder()
                .tripReview(review)
                .user(user)
                .content(content)
                .build();

        return commentRepository.save(comment);
    }

    public List<TripReviewComment> getComments(Long reviewId) {
        TripReview review = tripReviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("후기를 찾을 수 없습니다."));
        return commentRepository.findByTripReview(review);
    }

    public String toggleLike(Long reviewId, Long userId) {
        TripReview review = tripReviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("후기를 찾을 수 없습니다."));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        boolean alreadyLiked = likeRepository.existsByTripReviewAndUser(review, user);


        if (alreadyLiked) {
            likeRepository.deleteByTripReviewAndUser(review, user);
            return "좋아요 취소됨";
        } else {
            likeRepository.save(TripReviewLike.builder()
                    .tripReview(review)
                    .user(user)
                    .build());
            return "좋아요 등록됨";
        }
    }

    public long countLikes(Long reviewId) {
        TripReview review = tripReviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("후기를 찾을 수 없습니다."));
        return likeRepository.countByTripReview(review);
    }

}
