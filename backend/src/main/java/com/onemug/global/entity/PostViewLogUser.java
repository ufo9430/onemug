package com.onemug.global.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity(name = "post_view_log_user")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostViewLogUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private Long postId;

    private LocalDateTime viewedAt;
}
