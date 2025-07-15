package com.onemug.global.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class Notice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User receiver;

    private String targetName;

    @OneToOne
    @JoinColumn(name = "post_id")
    private Post targetPostId;

    private String content;
    private LocalDateTime createdAt;
}
