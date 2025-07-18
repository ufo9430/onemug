// feed/dto/PostDto.java
package com.onemug.feed.dto;

import com.onemug.global.entity.Post;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Builder
@Getter
public class PostDto {
    private Long id;
    private String title;
    private String content;
    private Integer viewCount;
    private Integer likeCount;
    private LocalDateTime createdAt;
    private String creatorNickname;

    public static PostDto from(Post p) {
        return PostDto.builder()
                .id(p.getId())
                .title(p.getTitle())
                .content(p.getContent())
                .viewCount(p.getViewCount())
                .likeCount(p.getLikeCount())
                .createdAt(p.getCreatedAt())               // :contentReference[oaicite:1]{index=1}
                .creatorNickname(p.getCreator().getUser().getNickname())
                .build();
    }
}
