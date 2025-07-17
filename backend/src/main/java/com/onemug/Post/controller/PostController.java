package com.onemug.Post.controller;

import com.onemug.Post.dto.PostCreateRequestDto;
import com.onemug.Post.dto.PostUpdateRequestDto;
import com.onemug.Post.service.PostService;
import com.onemug.global.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping("/user/{id}/posts")
    public Page<Post> getPostAll(@RequestParam(defaultValue = "0") int page,
                                 @RequestParam(defaultValue = "10") int size,
                                 @PathVariable Long id) {
        Pageable pageable = PageRequest.of(page, size);
        return postService.getPostAllByPage(id, pageable);
    }

    @GetMapping("/post/{id}")
    public Post getPost(@PathVariable Long id) {
        return postService.getPost(id);
    }

    @PostMapping("/c/post/add")
    public Post writePost(@RequestBody PostCreateRequestDto dto/*, @AuthenticationPrincipal OAuth2User user*/) {
        return postService.writePost(dto/*, user*/);
    }

    @PutMapping("/c/post/update/{id}")
    public Post updatePost(@PathVariable Long id, @RequestBody PostUpdateRequestDto dto) {
        Post currentPost = postService.getPost(id);
        currentPost.update(dto.getTitle(),dto.getContent());
        return postService.updatePost(currentPost);
    }

    @DeleteMapping("/c/post/delete/{id}")
    public void deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        // 게시글에 연결된 이미지나 다른 것들 삭제하기
    }
}
