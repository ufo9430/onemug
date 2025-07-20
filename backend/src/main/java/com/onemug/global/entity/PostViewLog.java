package com.onemug.global.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity(name = "post_view_log")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostViewLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long creatorId;

    private Long postId;

    private LocalDateTime viewedAt;
}
