package com.onemug.payment.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentConfirmResponseDto {
    
    private String status;        // SUCCESS, ERROR
    private String message;       // 응답 메시지
    private String paymentKey;    // 토스페이먼츠 결제 키
    private String orderId;       // 주문 ID
    private Long amount;          // 결제 금액
    private String paymentStatus; // 결제 상태
    private String approvedAt;    // 결제 승인 시간
    private String method;        // 결제 방법
    private String receipt;       // 영수증 정보
    private Long subscriptionId;  // 생성된 구독 ID
}
