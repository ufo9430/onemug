package com.onemug.postviewloguser.controller;

import com.onemug.global.entity.PostViewLogUser;
import com.onemug.postviewloguser.service.PostViewLogUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/post-view-log-user")
@RequiredArgsConstructor
public class PostViewLogUserController {

    private final PostViewLogUserService service;

    // 최근 본 글 목록 조회
    @GetMapping("/recent/{userId}")
    public List<PostViewLogUser> getRecentViews(@PathVariable Long userId) {
        return service.getRecentViewedPosts(userId);
    }

    // 글 본 기록 저장 (예: 글 상세 조회 시 호출)
    @PostMapping("/view")
    public void saveView(@RequestParam Long userId, @RequestParam Long postId) {
        service.saveViewLog(userId, postId);
    }
}
