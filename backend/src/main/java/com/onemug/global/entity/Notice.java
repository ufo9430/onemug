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

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private User receiver;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;

    private Long targetId;

    private String targetName;

    private String content;

    @Enumerated(EnumType.STRING)
    private NoticeType type;

    private LocalDateTime createdAt;

    private boolean isRead;

    public void markAsRead() {
        this.isRead = true;
    }
}
