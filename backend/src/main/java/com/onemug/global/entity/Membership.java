package com.onemug.global.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 멤버십 구독 정보를 관리하는 통합 엔티티
 * 기존 Membership와 MembershipSelection을 통합하여 15분 임시 선택 기능 제거
 * 템플릿 패턴으로 플랜(템플릿)과 실제 구독을 하나의 엔티티로 관리
 */
@Entity
@Table(name = "membership")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class Membership {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // === 사용자 정보 ===
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)  // 템플릿의 경우 null 허용
    private User user;
    
    // === 멤버십 상품 정보 ===
    @Column(nullable = false)
    private String membershipName;        // 멤버십 이름 (예: "프리미엄", "VIP")
    
    @Column(nullable = false)
    private Integer price;                // 가격
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    private Creator creator;
    
    // === Benefits 관계 ===
    @OneToMany(mappedBy = "membership", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Benefit> benefits = new ArrayList<>();
    
    // === 템플릿/구독 구분 ===
    @Column(nullable = false)
    private Boolean isTemplate = false;  // true: 플랜 템플릿, false: 실제 구독
    
    // 템플릿 기반 구독인 경우 원본 템플릿 ID 저장
    @Column(nullable = true)
    private Long templateId;  // 구독 시 참조한 템플릿 ID
    
    // === 구독 상태 관리 ===
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionStatus status = SubscriptionStatus.ACTIVE;
    
    @Column(nullable = false)
    private Boolean autoRenew = true;
    
    // 업그레이드 트래킹
    @Column(nullable = true)
    private Long upgradedFromMembershipId;  // 이전 멤버십 ID (업그레이드인 경우)
    
    // === 결제 정보 ===
    private String paymentMethod;        // 결제 방법 (카드, 계좌이체 등)
    private String orderId;              // 주문 ID (토스페이먼츠 등)
    
    // === 시간 정보 ===
    @Column(nullable = true)  // 템플릿의 경우 null 허용
    private LocalDateTime subscribedAt;   // 구독 시작일
    
    @Column(nullable = true)  // 템플릿의 경우 null 허용  
    private LocalDateTime expiresAt;      // 구독 만료일

    private LocalDateTime createdAt;      // 레코드 생성일
    private LocalDateTime updatedAt;      // 마지막 수정일
    private LocalDateTime cancelledAt;    // 취소 일시
    private String cancellationReason;    // 취소 사유
    
    // === JPA 생명주기 콜백 ===
    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        
        // 실제 구독(템플릿이 아닌 경우)만 시간 정보 설정
        if (!Boolean.TRUE.equals(this.isTemplate)) {
            if (this.subscribedAt == null) {
                this.subscribedAt = now;
            }
            
            // 기본값으로 1개월 구독 설정
            if (this.expiresAt == null) {
                this.expiresAt = this.subscribedAt.plusMonths(1);
            }
        }
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // === 비즈니스 메서드 ===
    
    /**
     * 구독이 만료되었는지 확인
     */
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiresAt);
    }
    
    /**
     * 구독이 활성 상태인지 확인
     */
    public boolean isActive() {
        return this.status == SubscriptionStatus.ACTIVE && !isExpired();
    }
    
    /**
     * 구독 연장
     */
    public void extend(int months) {
        this.expiresAt = this.expiresAt.plusMonths(months);
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * 구독 연장
     */
    public void extendSubscription(int months) {
        if (this.expiresAt != null) {
            this.expiresAt = this.expiresAt.plusMonths(months);
        } else {
            this.expiresAt = LocalDateTime.now().plusMonths(months);
        }
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * 구독 취소
     */
    public void cancel() {
        this.status = SubscriptionStatus.CANCELLED;
        this.autoRenew = false;
        this.cancelledAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * 구독 취소
     */
    public void cancel(String cancellationReason) {
        this.status = SubscriptionStatus.CANCELLED;
        this.autoRenew = false;
        this.cancelledAt = LocalDateTime.now();
        this.cancellationReason = cancellationReason;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * 만료된 구독을 만료 상태로 업데이트
     */
    public void markAsExpired() {
        if (isExpired() && this.status == SubscriptionStatus.ACTIVE) {
            this.status = SubscriptionStatus.EXPIRED;
            this.updatedAt = LocalDateTime.now();
        }
    }
    
    /**
     * 창작자 이름 조회 (동적)
     */
    public String getCreatorName() {
        if (creator != null && creator.getUser() != null) {
            return creator.getUser().getNickname();
        }
        return "Unknown Creator";
    }
    
    /**
     * 멤버십 표시용 이름 생성
     */
    public String getDisplayName() {
        return String.format("%s - %s (%s원/월)", 
                getCreatorName(), membershipName, 
                price != null ? String.format("%,d", price) : "0");
    }
    
    /**
     * 템플릿인지 확인
     */
    public boolean isTemplate() {
        return Boolean.TRUE.equals(this.isTemplate);
    }
    
    /**
     * 실제 구독인지 확인
     */
    public boolean isSubscription() {
        return !isTemplate();
    }
    
    /**
     * 템플릿으로부터 실제 구독 생성
     */
    public Membership createSubscriptionFor(User user) {
        if (!isTemplate()) {
            throw new IllegalStateException("템플릿이 아닌 경우 구독을 생성할 수 없습니다.");
        }
        
        return Membership.builder()
                .user(user)
                .membershipName(this.membershipName)
                .price(this.price)
                .creator(this.creator)
                .benefits(new ArrayList<>(this.benefits))
                .isTemplate(false)  // 실제 구독
                .status(SubscriptionStatus.PENDING)
                .autoRenew(true)
                .paymentMethod(null)
                .orderId(null)
                .templateId(this.id)  // 원본 템플릿 ID 저장
                .build();
    }
    
    /**
     * 구독 상태 enum
     */
    public enum SubscriptionStatus {
        PENDING,    // 결제 대기 중
        ACTIVE,     // 활성 구독
        EXPIRED,    // 만료됨
        CANCELLED   // 취소됨
    }
}
