package com.onemug.payment.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TossPaymentResponseDto {
    
    private String mId;           // 가맹점 ID
    private String version;       // Payment 객체 응답 버전
    private String paymentKey;    // 결제 키
    private String orderId;       // 주문 ID
    private String orderName;     // 주문명
    private String currency;      // 통화 코드
    private String method;        // 결제 방법
    private Long totalAmount;     // 총 결제 금액
    private Long balanceAmount;   // 취소할 수 있는 금액
    private String status;        // 결제 상태
    private String requestedAt;   // 결제 요청 시간
    private String approvedAt;    // 결제 승인 시간
    private Boolean useEscrow;    // 에스크로 사용 여부
    private String lastTransactionKey; // 마지막 거래 키
    private Long suppliedAmount;  // 공급가액
    private Long vat;             // 부가세
    private Boolean cultureExpense; // 문화비 지출 여부
    private Long taxFreeAmount;   // 비과세 금액
    private Integer taxExemptionAmount; // 과세 제외 금액
    private Receipt receipt;      // 영수증 정보
    private Checkout checkout;    // 결제창 정보
    private EasyPay easyPay;      // 간편결제 정보
    private String country;       // 국가 코드
    private Failure failure;      // 실패 정보
    private CashReceipt cashReceipt; // 현금영수증 정보
    private CashReceipts cashReceipts; // 현금영수증 배열
    private Discount discount;    // 할인 정보
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Receipt {
        private String url;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Checkout {
        private String url;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EasyPay {
        private String provider;
        private Long amount;
        private Long discountAmount;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Failure {
        private String code;
        private String message;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CashReceipt {
        private String type;
        private String receiptKey;
        private String issueNumber;
        private String receiptUrl;
        private Long amount;
        private Long taxFreeAmount;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CashReceipts {
        private String receiptKey;
        private String orderId;
        private String orderName;
        private String type;
        private String issueNumber;
        private String receiptUrl;
        private String businessNumber;
        private String transactionType;
        private Long amount;
        private Long taxFreeAmount;
        private String issueStatus;
        private Failure failure;
        private String customerIdentityNumber;
        private String requestedAt;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Discount {
        private Long amount;
    }
}
