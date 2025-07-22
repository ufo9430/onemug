package com.onemug.Post.dto;

import com.onemug.global.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostDetailResponseDTO {
    private Long id;
    private String title;
    private String content;
    private String categoryName;
    private LocalDateTime createdAt;
    private Integer likeCount;
    private String authorName;
    private Boolean liked;

    public static PostDetailResponseDTO from(Post post, String authorName, Boolean liked) {
        return new PostDetailResponseDTO(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getCategory().getName(),
                post.getCreatedAt(),
                post.getLikeCount(),
                authorName,
                liked
        );
    }
}
