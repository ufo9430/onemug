package com.onemug.membership.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 구독 생성 응답 DTO (Membership 기반으로 통합)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionCreateResponseDto {
    private String status; // "SUCCESS", "ERROR"
    private String message;
    private Long subscriptionId;
    private Long membershipId;
    private String membershipName;
    private Integer price;
    private String creatorName;
    private List<String> benefits;
    private Boolean autoRenew;
    private String paymentMethod;
    private Boolean isFree;
    private String nextStep; // "COMPLETE", "PAYMENT"
    private LocalDateTime createdAt;
    
    public static SubscriptionCreateResponseDto success(
            Long subscriptionId, 
            String membershipName,
            Integer price,
            String creatorName,
            List<String> benefits,
            boolean isFree, 
            String nextStep, 
            String message) {
            
        return SubscriptionCreateResponseDto.builder()
                .status("SUCCESS")
                .message(message)
                .subscriptionId(subscriptionId)
                .membershipId(subscriptionId) // Membership의 ID를 membershipId로 사용
                .membershipName(membershipName)
                .price(price)
                .creatorName(creatorName)
                .benefits(benefits != null ? benefits : List.of())
                .isFree(isFree)
                .nextStep(nextStep)
                .createdAt(LocalDateTime.now())
                .build();
    }
    
    public static SubscriptionCreateResponseDto error(String message) {
        return SubscriptionCreateResponseDto.builder()
                .status("ERROR")
                .message(message)
                .nextStep("SELECT")
                .build();
    }
}
