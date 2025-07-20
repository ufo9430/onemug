package com.onemug.membership.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionCancelResponseDto {

    private String status;        // SUCCESS, ERROR
    private String message;       // 응답 메시지
    private Long membershipId;    // 취소된 멤버십 ID
    private String membershipName; // 취소된 멤버십 이름
    private Long creatorId;   // 창작자 id
    private LocalDateTime cancelledAt; // 취소 시점
    private String previousStatus; // 이전 상태
    private boolean wasAutoRenew; // 자동 갱신 여부 (취소 전)
    private Long userId;          // 취소한 사용자 ID

    // 성공 응답 생성 헬퍼 메서드
    public static SubscriptionCancelResponseDto success(Long membershipId, String membershipName,
                                                       Long creatorId, Long userId,
                                                       String previousStatus, boolean wasAutoRenew) {
        return SubscriptionCancelResponseDto.builder()
                .status("SUCCESS")
                .message("구독이 성공적으로 취소되었습니다.")
                .membershipId(membershipId)
                .membershipName(membershipName)
                .creatorId(creatorId)
                .cancelledAt(LocalDateTime.now())
                .previousStatus(previousStatus)
                .wasAutoRenew(wasAutoRenew)
                .userId(userId)
                .build();
    }

    // 실패 응답 생성 헬퍼 메서드
    public static SubscriptionCancelResponseDto error(String message, Long membershipId, Long userId) {
        return SubscriptionCancelResponseDto.builder()
                .status("ERROR")
                .message(message)
                .membershipId(membershipId)
                .userId(userId)
                .cancelledAt(LocalDateTime.now())
                .build();
    }
}
