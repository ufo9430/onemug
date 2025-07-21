package com.onemug.Post.controller;

import com.onemug.Post.dto.PostCreateRequestDto;
import com.onemug.Post.dto.PostResponseDTO;
import com.onemug.Post.dto.PostUpdateRequestDto;
import com.onemug.Post.service.PostService;
import com.onemug.global.entity.Creator;
import com.onemug.global.entity.Post;
import com.onemug.newcreator.repository.CreatorRegisterRepository;
import com.onemug.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")
public class PostController {
    private final PostService postService;
    private final CreatorRegisterRepository creatorRegisterRepository;
    private final UserRepository userRepository;

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
    public ResponseEntity<PostResponseDTO> writePost(@RequestBody PostCreateRequestDto dto, @AuthenticationPrincipal Jwt jwt) {
        System.out.println("=== JWT PRINCIPAL ===");
        System.out.println(jwt);
        System.out.println("Token Value = " + jwt.getTokenValue());
        System.out.println("Claims = " + jwt.getClaims());

        Long userId = Long.parseLong(jwt.getSubject()); // sub == userId

        // userId로 creator 조회
        Creator creator = creatorRegisterRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Creator not found"));

        Long creatorId = creator.getId();

        if (!creatorRegisterRepository.existsById(creatorId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        Post post = postService.writePost(dto, creatorId);
        PostResponseDTO response = PostResponseDTO.from(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/c/post/update/{id}")
    public ResponseEntity<PostResponseDTO> updatePost(@PathVariable Long id,
                                                      @RequestBody PostUpdateRequestDto dto) {
        Post post = postService.updatePost(id, dto);
        PostResponseDTO updatedPost = PostResponseDTO.from(post);
        return ResponseEntity.ok(updatedPost);
    }

    @DeleteMapping("/c/post/delete/{id}")
    public void deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        // 게시글에 연결된 이미지나 다른 것들 삭제하기
    }
}
