package com.onemug.global.dto;

import com.onemug.global.entity.Creator;
import com.onemug.global.entity.Membership;
import com.onemug.global.entity.User;
import com.onemug.global.entity.Benefit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 멤버십 응답 DTO (Membership 기반으로 통합)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MembershipResponseDto {
    private Long id;
    private String name;
    private Integer price;
    private String creatorName;
    private LocalDateTime subscribedAt;
    private LocalDateTime expiresAt;
    private String status; // ACTIVE, EXPIRED, CANCELLED, PENDING
    private Boolean autoRenew;
    private Long creatorId;
    private Long subscriberId;
    private String membershipName;
    private List<String> benefits;

    // Static factory method for Membership
    public static MembershipResponseDto from(Membership membership) {
        if (membership == null) {
            return null;
        }
        
        // 수동으로 빌더 패턴 대체 (Lombok 문제 우회)
        MembershipResponseDto dto = new MembershipResponseDto();
        dto.id = membership.getId();
        dto.name = membership.getMembershipName();
        dto.price = membership.getPrice() != null ? membership.getPrice().intValue() : 0;
        dto.creatorName = membership.getCreatorName();
        dto.creatorId = membership.getCreator() != null ? membership.getCreator().getId() : null;
        dto.subscriberId = membership.getUser() != null ? membership.getUser().getId() : null;
        dto.subscribedAt = membership.getSubscribedAt();
        dto.expiresAt = membership.getExpiresAt();
        dto.status = membership.getStatus() != null ? membership.getStatus().name() : "UNKNOWN";
        dto.autoRenew = membership.getAutoRenew();
        dto.membershipName = membership.getMembershipName();
        dto.benefits = membership.getBenefits() != null 
            ? membership.getBenefits().stream().map(Benefit::getContent).collect(Collectors.toList())
            : List.of(); // 빈 리스트 반환
        
        return dto;
    }
}
