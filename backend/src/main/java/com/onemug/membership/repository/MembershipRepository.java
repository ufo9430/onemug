package com.onemug.membership.repository;

import com.onemug.global.entity.Membership;
import com.onemug.global.entity.Membership.SubscriptionStatus;
import com.onemug.global.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Membership 엔티티를 위한 Repository
 * 기존 Membership과 MembershipSelection 관련 쿼리를 통합
 * 템플릿 패턴으로 플랜 템플릿과 실제 구독을 모두 관리
 */
@Repository
public interface MembershipRepository extends JpaRepository<Membership, Long> {
    
    // === 템플릿(플랜) 관리 ===
    
    /**
     * 모든 플랜 템플릿 조회 (생성일순) - Benefits 포함
     */
    @Query("SELECT DISTINCT m FROM Membership m LEFT JOIN FETCH m.benefits WHERE m.isTemplate = true ORDER BY m.createdAt DESC")
    List<Membership> findAllTemplates();
    
    /**
     * 특정 창작자의 플랜 템플릿 조회 - Benefits 포함
     */
    @Query("SELECT DISTINCT m FROM Membership m LEFT JOIN FETCH m.benefits WHERE m.isTemplate = true AND m.creator.id = :creatorId ORDER BY m.price ASC")
    List<Membership> findTemplatesByCreatorId(@Param("creatorId") Long creatorId);
    
    /**
     * 플랜 템플릿 ID로 조회
     */
    @Query("SELECT m FROM Membership m WHERE m.id = :templateId AND m.isTemplate = true")
    Optional<Membership> findTemplateById(@Param("templateId") Long templateId);
    
    /**
     * 플랜 이름으로 템플릿 검색
     */
    @Query("SELECT m FROM Membership m WHERE m.isTemplate = true AND m.membershipName LIKE %:keyword% ORDER BY m.createdAt DESC")
    List<Membership> searchTemplatesByName(@Param("keyword") String keyword);
    
    // === 사용자별 구독 조회 ===
    
    /**
     * 사용자의 모든 구독 목록 조회 (최신순)
     */
    @Query("SELECT m FROM Membership m WHERE m.user.id = :userId AND m.isTemplate = false ORDER BY m.createdAt DESC")
    List<Membership> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
    
    /**
     * 사용자의 활성 구독만 조회
     */
    @Query("SELECT m FROM Membership m WHERE m.user.id = :userId AND m.isTemplate = false AND m.status = 'ACTIVE' AND m.expiresAt > :now ORDER BY m.expiresAt ASC")
    List<Membership> findActiveSubscriptionsByUserId(@Param("userId") Long userId, @Param("now") LocalDateTime now);
    
    /**
     * 사용자의 특정 창작자 구독 조회
     */
    @Query("SELECT m FROM Membership m WHERE m.user.id = :userId AND m.creator.id = :creatorId AND m.isTemplate = false ORDER BY m.createdAt DESC")
    List<Membership> findByUserIdAndCreatorId(@Param("userId") Long userId, @Param("creatorId") Long creatorId);
    
    /**
     * 사용자가 특정 창작자의 활성 구독을 가지고 있는지 확인
     */
    @Query("SELECT COUNT(m) > 0 FROM Membership m WHERE m.user.id = :userId AND m.creator.id = :creatorId AND m.isTemplate = false AND m.status = 'ACTIVE' AND m.expiresAt > :now")
    boolean hasActiveSubscriptionForCreator(@Param("userId") Long userId, @Param("creatorId") Long creatorId, @Param("now") LocalDateTime now);
    
    /**
     * 사용자의 특정 창작자에 대한 활성 구독 목록 조회
     */
    @Query("SELECT m FROM Membership m WHERE m.user.id = :userId AND m.creator.id = :creatorId AND m.isTemplate = false AND m.status = 'ACTIVE' AND m.expiresAt > :now ORDER BY m.createdAt DESC")
    List<Membership> findActiveSubscriptionsByUserAndCreator(@Param("userId") Long userId, @Param("creatorId") Long creatorId, @Param("now") LocalDateTime now);
    
    // === 창작자별 구독 조회 ===
    
    /**
     * 창작자의 모든 구독자 목록 조회
     */
    @Query("SELECT m FROM Membership m WHERE m.creator.id = :creatorId AND m.isTemplate = false ORDER BY m.createdAt DESC")
    List<Membership> findByCreatorIdOrderByCreatedAtDesc(@Param("creatorId") Long creatorId);
    
    /**
     * 창작자의 활성 구독자만 조회
     */
    @Query("SELECT m FROM Membership m WHERE m.creator.id = :creatorId AND m.isTemplate = false AND m.status = 'ACTIVE' AND m.expiresAt > :now ORDER BY m.createdAt DESC")
    List<Membership> findActiveSubscriptionsByCreatorId(@Param("creatorId") Long creatorId, @Param("now") LocalDateTime now);
    
    /**
     * 창작자의 구독자 수 조회
     */
    @Query("SELECT COUNT(m) FROM Membership m WHERE m.creator.id = :creatorId AND m.isTemplate = false AND m.status = 'ACTIVE' AND m.expiresAt > :now")
    Long countActiveSubscribersByCreatorId(@Param("creatorId") Long creatorId, @Param("now") LocalDateTime now);
    
    // === 통계 및 분석 ===
    
    /**
     * 상태별 구독 개수 조회
     */
    @Query("SELECT COUNT(m) FROM Membership m WHERE m.status = :status AND m.isTemplate = false")
    Long countByStatus(@Param("status") SubscriptionStatus status);
    
    /**
     * 특정 날짜 이후 생성된 구독 조회
     */
    @Query("SELECT m FROM Membership m WHERE m.createdAt >= :date AND m.isTemplate = false ORDER BY m.createdAt DESC")
    List<Membership> findSubscriptionsCreatedAfter(@Param("date") LocalDateTime date);
    
    /**
     * 만료된 구독 목록 조회 (정리용)
     */
    @Query("SELECT m FROM Membership m WHERE m.expiresAt < :now AND m.status = 'ACTIVE' AND m.isTemplate = false")
    List<Membership> findExpiredActiveSubscriptions(@Param("now") LocalDateTime now);
    
    /**
     * 전체 활성 구독 수 조회
     */
    @Query("SELECT COUNT(m) FROM Membership m WHERE m.status = 'ACTIVE' AND m.expiresAt > :now")
    long countActiveSubscriptions(@Param("now") LocalDateTime now);
    
    /**
     * 멤버십별 구독 통계 조회
     */
    @Query("SELECT m.membershipName, COUNT(m), SUM(m.price) FROM Membership m WHERE m.status = 'ACTIVE' GROUP BY m.membershipName ORDER BY COUNT(m) DESC")
    List<Object[]> getMembershipSubscriptionStats();
    
    /**
     * 가격대별 분포 조회
     */
    @Query("SELECT " +
           "CASE " +
           "WHEN m.price = 0 THEN '무료' " +
           "WHEN m.price <= 5000 THEN '5천원 이하' " +
           "WHEN m.price <= 10000 THEN '1만원 이하' " +
           "WHEN m.price <= 20000 THEN '2만원 이하' " +
           "ELSE '2만원 초과' " +
           "END as priceRange, " +
           "COUNT(m) as count " +
           "FROM Membership m " +
           "WHERE m.status = 'ACTIVE' " +
           "GROUP BY " +
           "CASE " +
           "WHEN m.price = 0 THEN '무료' " +
           "WHEN m.price <= 5000 THEN '5천원 이하' " +
           "WHEN m.price <= 10000 THEN '1만원 이하' " +
           "WHEN m.price <= 20000 THEN '2만원 이하' " +
           "ELSE '2만원 초과' " +
           "END " +
           "ORDER BY MIN(m.price)")
    List<Object[]> getPriceDistribution();
    
    // === 검색 및 필터링 ===
    
    /**
     * 멤버십 이름으로 구독 검색
     */
    @Query("SELECT m FROM Membership m WHERE m.membershipName LIKE %:keyword% AND m.isTemplate = false ORDER BY m.createdAt DESC")
    List<Membership> searchSubscriptionsByMembershipName(@Param("keyword") String keyword);
    
    /**
     * 가격 범위로 구독 검색
     */
    @Query("SELECT m FROM Membership m WHERE m.price BETWEEN :minPrice AND :maxPrice AND m.isTemplate = false ORDER BY m.price ASC")
    List<Membership> findSubscriptionsByPriceRange(@Param("minPrice") Integer minPrice, @Param("maxPrice") Integer maxPrice);
    
    /**
     * 특정 결제 방법으로 구독 조회
     */
    @Query("SELECT m FROM Membership m WHERE m.paymentMethod = :paymentMethod AND m.isTemplate = false ORDER BY m.createdAt DESC")
    List<Membership> findSubscriptionsByPaymentMethod(@Param("paymentMethod") String paymentMethod);


    @Query("SELECT m.creator.id FROM Membership m " +
            "WHERE m.user.id = :userId " +
            "AND m.status = 'ACTIVE' " +
            "AND m.isTemplate = false " +
            "AND (m.expiresAt IS NULL OR m.expiresAt > CURRENT_TIMESTAMP)")
    List<Long> findActiveCreatorIdsByUserId(@Param("userId") Long userId);

    List<Membership> findAllByCreatorIdAndIsTemplateTrue(Long creatorId);

    @Query("select m from Membership m where m.user = :user and m.status = :status")
    List<Membership> findAllByUserAndStatus(@Param("user") User user, @Param("status") Membership.SubscriptionStatus status);


}
