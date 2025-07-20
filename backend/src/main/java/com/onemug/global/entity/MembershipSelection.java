package com.onemug.global.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class MembershipSelection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String selectionId; // UUID로 생성되는 고유 ID
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "membership_id", nullable = false)
    private Membership membership;
    
    private Boolean autoRenew;
    private String paymentMethod;
    
    @Enumerated(EnumType.STRING)
    private SelectionStatus status;
    
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt; // 15분 후 만료
    
    public enum SelectionStatus {
        PENDING,    // 대기 중
        CONFIRMED,  // 확인됨
        EXPIRED,    // 만료됨
        CANCELLED   // 취소됨
    }
    
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.expiresAt = LocalDateTime.now().plusMinutes(15);
        this.status = SelectionStatus.PENDING;
    }
    
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiresAt);
    }
}
