package com.onemug.global.dto;

import com.onemug.global.entity.Creator;
import com.onemug.global.entity.Membership;
import com.onemug.global.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MembershipResponseDto {
    private Long id;
    private String name;
    private Integer price;
    private String creatorName;
    private LocalDateTime subscribedAt;
    private LocalDateTime expiresAt;
    private String status; // ACTIVE, EXPIRED, CANCELLED
    private Boolean autoRenew;
    private Long creatorId;
    private Long subscriberId;

    // Static factory method
    public static MembershipResponseDto from(Membership membership) {
        return MembershipResponseDto.builder()
                .id(membership.getId())
                .name(membership.getName())
                .price(membership.getPrice())
                .creatorName(membership.getCreator() != null && membership.getCreator().getUser() != null ?
                        membership.getCreator().getUser().getNickname() : "Unknown Creator")
                .creatorId(membership.getCreator().getId())
                .subscribedAt(membership.getCreatedAt())
                .expiresAt(membership.getCreatedAt() != null ?
                        membership.getCreatedAt().plusMonths(1) : LocalDateTime.now().plusMonths(1))
                .status(getSubscriptionStatus(membership.getCreatedAt()))
                .autoRenew(true)
                .build();
    }
    
    private static String getSubscriptionStatus(LocalDateTime createdAt) {
        // 구독 상태 판별 로직
        LocalDateTime now = LocalDateTime.now();
        if (createdAt.plusMonths(1).isBefore(now)) {
            return "EXPIRED";
        }
        return "ACTIVE";
    }
}
