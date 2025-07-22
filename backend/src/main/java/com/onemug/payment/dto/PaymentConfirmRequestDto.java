package com.onemug.payment.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentConfirmRequestDto {
    
    private String paymentKey; // 토스페이먼츠 결제 키
    private String orderId;    // 주문 ID
    private Long amount;       // 결제 금액
    private Long userId;       // 사용자 ID
    private Long membershipId; // 멤버십 ID
}
