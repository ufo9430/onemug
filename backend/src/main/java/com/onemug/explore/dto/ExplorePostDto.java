package com.onemug.explore.dto;

import java.time.LocalDateTime;

/**
 * 구독하지 않은 창작자의 글을 노출하기 위한 간략 DTO.
 */
public record ExplorePostDto(
        Long id,
        String title,
        String creatorNickname,
        String categoryName,
        int viewCount,
        int likeCount,
        LocalDateTime createdAt
) {}