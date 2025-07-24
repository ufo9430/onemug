package com.onemug.Post.dto;

import com.onemug.global.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostResponseDTO {
    private Long id;
    private String title;
    private String content;
    private String categoryName;
    private Long creatorId; // 혹은 creatorId 등 필요한 필드

    public static PostResponseDTO from(Post post) {
        return new PostResponseDTO(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getCategory().getName(),
                post.getCreator().getId()
        );
    }
}
