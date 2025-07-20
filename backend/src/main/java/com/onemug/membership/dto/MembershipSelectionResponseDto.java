package com.onemug.membership.dto;

import com.onemug.global.entity.Creator;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MembershipSelectionResponseDto {
    private String selectionId; // 고유한 선택 ID
    private Long membershipId;
    private String membershipName;
    private Integer price;
    private String creatorName;
    private List<String> benefits;
    private Boolean autoRenew;
    private String paymentMethod;
    private LocalDateTime expiresAt; // 선택 만료 시간 (15분)
    private String status; // "PENDING", "CONFIRMED", "EXPIRED"
    private String message;
    // 추가 필드
    private CurrentSubscribedMembershipDto currentSubscribedMembership;
    private Boolean isFree;
    private String nextStep;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CurrentSubscribedMembershipDto {
        private Long id;
        private String name;
        private Integer price;
        private String status;
    }
}
