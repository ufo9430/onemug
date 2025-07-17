package com.onemug.like.controller;

import com.onemug.like.dto.LikeResponseDTO;
import com.onemug.like.service.LikeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LikeController {
    private final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping("/post/{id}/like")
    public ResponseEntity<LikeResponseDTO> likePost(@PathVariable Long id/*, @AuthenticationPrincipal OAuth2User user*/) {

        int updatedCount = likeService.likePost(id/*, user*/);
        return ResponseEntity.ok(new LikeResponseDTO("Liked", updatedCount));
    }

    @DeleteMapping("/post/{id}/like")
    public ResponseEntity<LikeResponseDTO> dislikePost(@PathVariable Long id/*, @AuthenticationPrincipal OAuth2User user*/) {
        int updatedCount = likeService.dislikePost(id/*, user*/);
        return ResponseEntity.ok(new LikeResponseDTO("Liked", updatedCount));
    }
}
