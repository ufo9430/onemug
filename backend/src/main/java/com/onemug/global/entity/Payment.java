package com.onemug.global.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String paymentKey; // 토스페이먼츠 결제 키
    
    @Column(nullable = false, unique = true)
    private String orderId; // 주문 ID
    
    @Column(nullable = false)
    private String orderName; // 주문명
    
    @Column(nullable = false)
    private Long amount; // 결제 금액
    
    @Column(nullable = false)
    private Long userId; // 결제한 사용자 ID

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "membership_id", nullable = true) // nullable=true 명시적 추가
    private Membership membership; // 결제한 멤버십
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status; // 결제 상태
    
    @Enumerated(EnumType.STRING)
    private PaymentMethod method; // 결제 방법
    
    @Column
    private String approvedAt; // 결제 승인 시간 (토스페이먼츠 형식)
    
    @Column
    private String requestedAt; // 결제 요청 시간 (토스페이먼츠 형식)
    
    @Column
    private String receipt; // 영수증 정보
    
    @Column
    private String failureCode; // 실패 코드
    
    @Column
    private String failureMessage; // 실패 메시지
    
    @Column(nullable = false)
    private LocalDateTime createdAt; // 생성 시간
    
    @Column
    private LocalDateTime updatedAt; // 수정 시간
    
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    public enum PaymentStatus {
        READY,      // 결제 준비
        IN_PROGRESS, // 결제 진행 중
        WAITING_FOR_DEPOSIT, // 입금 대기 중
        DONE,       // 결제 완료
        CANCELED,   // 결제 취소
        PARTIAL_CANCELED, // 부분 취소
        ABORTED,    // 결제 중단
        EXPIRED     // 결제 만료
    }
    
    public enum PaymentMethod {
        CARD,           // 카드
        VIRTUAL_ACCOUNT, // 가상계좌
        TRANSFER,       // 계좌이체
        MOBILE_PHONE,   // 휴대폰
        CULTURE_GIFT_CERTIFICATE, // 문화상품권
        BOOK_GIFT_CERTIFICATE,    // 도서문화상품권
        GAME_GIFT_CERTIFICATE     // 게임문화상품권
    }
}
