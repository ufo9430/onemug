package com.onemug.like.controller;

import com.onemug.global.utils.AuthUtils;
import com.onemug.like.dto.LikeResponseDTO;
import com.onemug.like.service.LikeService;
import com.onemug.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class LikeController {
    private final LikeService likeService;
    private final UserRepository userRepository;

    @PostMapping("/post/{id}/like")
    public ResponseEntity<LikeResponseDTO> likePost(@PathVariable Long id, @AuthenticationPrincipal Object principal) {
        Long userId = AuthUtils.extractUserId(principal, userRepository);
        int updatedCount = likeService.likePost(id, userId);
        return ResponseEntity.ok(new LikeResponseDTO("Liked", updatedCount));
    }

    @DeleteMapping("/post/{id}/like")
    public ResponseEntity<LikeResponseDTO> dislikePost(@PathVariable Long id, @AuthenticationPrincipal Object principal) {
        Long userId = AuthUtils.extractUserId(principal, userRepository);
        int updatedCount = likeService.dislikePost(id, userId);
        return ResponseEntity.ok(new LikeResponseDTO("Liked", updatedCount));
    }
}
