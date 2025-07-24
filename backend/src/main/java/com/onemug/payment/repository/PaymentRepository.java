package com.onemug.payment.repository;

import com.onemug.global.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    // 결제 키로 결제 정보 조회
    Optional<Payment> findByPaymentKey(String paymentKey);
    
    // 주문 ID로 결제 정보 조회
    Optional<Payment> findByOrderId(String orderId);
    
    // 사용자 ID로 결제 목록 조회
    List<Payment> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // 사용자 ID와 결제 상태로 결제 목록 조회
    List<Payment> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, Payment.PaymentStatus status);
    
    // 멤버십 ID로 성공한 결제 목록 조회
    @Query("SELECT p FROM Payment p WHERE p.membership.id = :membershipId AND p.status = 'DONE' ORDER BY p.createdAt DESC")
    List<Payment> findSuccessfulPaymentsByMembershipId(@Param("membershipId") Long membershipId);
    
    // 사용자 ID와 멤버십 ID로 가장 최근 성공한 결제 조회
    @Query("SELECT p FROM Payment p WHERE p.userId = :userId AND p.membership.id = :membershipId AND p.status = 'DONE' ORDER BY p.createdAt DESC")
    Optional<Payment> findLatestSuccessfulPaymentByUserAndMembership(@Param("userId") Long userId, @Param("membershipId") Long membershipId);
}
