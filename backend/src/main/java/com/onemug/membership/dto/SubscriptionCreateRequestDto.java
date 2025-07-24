package com.onemug.membership.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 구독 생성 요청 DTO (MembershipSelection 통합)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionCreateRequestDto {
    private Long membershipId;
    private Long userId;
    private Long creatorId;
    private String membershipName;
    private Long price;
    private Boolean autoRenew;
    private String paymentMethod; // "CARD", "BANK_TRANSFER", "TOSS"
    private String orderId;
    private Long currentMembershipId; // 업그레이드인 경우 현재 멤버십 ID
}
