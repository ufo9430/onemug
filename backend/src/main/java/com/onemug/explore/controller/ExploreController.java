// src/main/java/com/onemug/explore/controller/ExploreController.java
package com.onemug.explore.controller;

import com.onemug.explore.dto.ExplorePostDto;
import com.onemug.explore.service.ExploreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/explore")
@Tag(name = "Explore")
public class ExploreController {

    private final ExploreService exploreService;

    @Operation(summary = "Explore – 구독 안 한 창작자 글 조회")
    @GetMapping
    public ResponseEntity<Page<ExplorePostDto>> explore(
            @RequestParam("user") Long userId,                      // 로그인 유저 ID (임시)
            @RequestParam(value = "category", required = false) Long categoryId,
            @ParameterObject Pageable pageable
    ) {
        Page<ExplorePostDto> body = exploreService.getExplorePosts(userId, categoryId, pageable);
        return ResponseEntity.ok(body);
    }
}
