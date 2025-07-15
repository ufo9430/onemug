package com.onemug.global.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Entity
//@Document(collection = "post")
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long _id;

    private String title;
    private String content;

    private Long categoryId;
    private Long userId;
    private Integer viewCount;
    private Integer likeCount;

    private LocalDateTime createdAt;
//    private LocalDateTime updatedAt;
    public void update(String title, String content) {
        this.title = title;
        this.content = content;
    }
}
