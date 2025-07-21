package com.onemug.global.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Entity
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String content;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private Creator creator;

    private Integer viewCount;
    private Integer likeCount;

    private LocalDateTime createdAt;
//    private LocalDateTime updatedAt;
    public void update(String title, String content) {
        this.title = title;
        this.content = content;
    }

    public void incrementViewCount() {
        this.viewCount = this.viewCount + 1;
    }

    public void incrementLikeCount() {
        this.likeCount = this.likeCount + 1;
    }

    public void decrementLikeCount() {
        this.likeCount = this.likeCount > 0 ? this.likeCount - 1 : 0;
    }

    @PrePersist
    public void prePersist() {
        this.likeCount = 0;
        this.viewCount = 0;
        this.createdAt = LocalDateTime.now();
    }

    public void addViewCount() {
        this.viewCount++;
    }
}
