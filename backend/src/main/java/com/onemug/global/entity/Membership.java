package com.onemug.global.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class Membership {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Integer price;

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private Creator creator;

    private LocalDateTime createdAt;
    
    // 추가 필드들
    private String status;
    private Boolean autoRenew;
    private LocalDateTime subscribedAt;
    private LocalDateTime expiresAt;

    @OneToMany
    private List<Benefit> benefitList = new ArrayList<>();

    // creatorName을 동적으로 가져오는 메서드
    public String getCreatorName() {
        if (creator != null && creator.getUser() != null) {
            return creator.getUser().getNickname();
        }
        return "Unknown Creator";
    }
}
