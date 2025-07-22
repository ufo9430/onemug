package com.onemug.bookmark.controller;

import com.onemug.bookmark.service.PostLikeService;
import com.onemug.feed.dto.PostDto;

import com.onemug.global.entity.Post;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class PostLikeController {
    private final PostLikeService postLikeService;

    @GetMapping("/users/liked-posts")
    public ResponseEntity<List<PostDto>> getLikedPosts(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long userId = Long.parseLong(authentication.getName());

        List<Post> posts = postLikeService.getLikedPosts(userId);
        return ResponseEntity.ok(posts.stream().map(PostDto::from).toList());
    }

    @PostMapping("/posts/{postId}/like")
    public void like(@PathVariable Long postId, @RequestParam Long userId) {
        postLikeService.like(userId, postId);
    }

    @DeleteMapping("/posts/{postId}/like")
    public void unlike(@PathVariable Long postId, @RequestParam Long userId) {
        postLikeService.unlike(userId, postId);
    }
}
