package com.onemug.postviewloguser.controller;

import com.onemug.global.entity.PostViewLogUser;
import com.onemug.postviewloguser.service.PostViewLogUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/post-view-log-user")
@RequiredArgsConstructor
public class PostViewLogUserController {

    private final PostViewLogUserService service;

    // 최근 본 글 목록 조회
    @GetMapping("/recent")
    public ResponseEntity<List<PostViewLogUser>> getRecentViews(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long userId = Long.parseLong(authentication.getName());

        return ResponseEntity.ok(service.getRecentViewedPosts(userId));
    }

}
