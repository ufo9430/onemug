package com.onemug.bookmark.controller;

import com.onemug.bookmark.service.PostLikeService;
import com.onemug.feed.dto.PostDto;

import com.onemug.global.entity.Post;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class PostLikeController {
    private final PostLikeService postLikeService;

    @GetMapping("/users/{userId}/liked-posts")
    public List<PostDto> getLikedPosts(@PathVariable Long userId) {
        List<Post> posts = postLikeService.getLikedPosts(userId);
        return posts.stream().map(PostDto::from).toList();
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
