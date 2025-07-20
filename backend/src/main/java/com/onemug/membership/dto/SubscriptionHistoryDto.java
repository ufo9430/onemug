package com.onemug.membership.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionHistoryDto {
    private Long id;
    private String membershipName;
    private Integer price;
    private String creatorName;
    private LocalDateTime subscribedAt;
    private LocalDateTime expiresAt;
    private String paymentMethod;
    private String status; // ACTIVE, EXPIRED, CANCELLED
}
