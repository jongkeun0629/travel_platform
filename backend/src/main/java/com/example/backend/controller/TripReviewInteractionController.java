package com.example.backend.controller;

import com.example.backend.entity.TripReviewComment;
import com.example.backend.service.TripReviewInteractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/trip-reviews")
@RequiredArgsConstructor
public class TripReviewInteractionController {

    private final TripReviewInteractionService interactionService;

    // 응답용 로컬 DTO (파일 추가 없음)
    record CommentDto(Long id, Long userId, String username, String content, LocalDateTime createdAt) {}

    @PostMapping("/{reviewId}/comments")
    public ResponseEntity<CommentDto> addComment(
            @PathVariable Long reviewId,
            @RequestParam Long userId,
            @RequestParam String content
    ) {
        TripReviewComment c = interactionService.addComment(reviewId, userId, content);
        CommentDto dto = new CommentDto(
                c.getId(),
                c.getUser().getId(),
                c.getUser().getUsername(),
                c.getContent(),
                c.getCreatedAt()
        );
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{reviewId}/comments")
    public ResponseEntity<List<CommentDto>> getComments(@PathVariable Long reviewId) {
        List<TripReviewComment> list = interactionService.getComments(reviewId);
        List<CommentDto> dtoList = list.stream()
                .map(c -> new CommentDto(
                        c.getId(),
                        c.getUser().getId(),
                        c.getUser().getUsername(),
                        c.getContent(),
                        c.getCreatedAt()
                ))
                .toList();
        return ResponseEntity.ok(dtoList);
    }

    @PostMapping("/{reviewId}/like")
    public ResponseEntity<String> toggleLike(
            @PathVariable Long reviewId,
            @RequestParam Long userId
    ) {
        return ResponseEntity.ok(interactionService.toggleLike(reviewId, userId));
    }

    @GetMapping("/{reviewId}/likes")
    public ResponseEntity<Long> countLikes(@PathVariable Long reviewId) {
        return ResponseEntity.ok(interactionService.countLikes(reviewId));
    }
}
