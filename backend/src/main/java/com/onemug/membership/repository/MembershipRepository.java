package com.onemug.membership.repository;

import com.onemug.global.entity.Membership;
import com.onemug.global.entity.Creator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, Long> {
    
    /**
     * 사용자가 구독한 멤버십 목록 조회 (구독 시작일 기준 오름차순)
     */
    @Query("SELECT m FROM Membership m WHERE m.id IN (SELECT s.id FROM User u JOIN u.subscribed s WHERE u.id = :userId) ORDER BY m.createdAt ASC")
    List<Membership> findSubscribedMembershipsByUserId(@Param("userId") Long userId);
    
    /**
     * 크리에이터별 멤버십 조회
     */
    List<Membership> findByCreatorId(Long creatorId);
    
    /**
     * 멤버십 이름으로 검색
     */
    List<Membership> findByNameContainingIgnoreCase(String name);
    
    /**
     * 모든 멤버십을 생성일 기준 내림차순으로 조회
     */
    @Query("SELECT m FROM Membership m ORDER BY m.createdAt DESC")
    List<Membership> findAllOrderByCreatedAtDesc();
    
    /**
     * 사용자의 현재 활성 구독 멤버십 조회
     */
    @Query("SELECT m FROM Membership m WHERE m.id IN (SELECT s.id FROM User u JOIN u.subscribed s WHERE u.id = :userId) AND m.status = 'ACTIVE' AND m.expiresAt > :currentDate")
    List<Membership> findActiveSubscriptionsByUserId(@Param("userId") Long userId, @Param("currentDate") LocalDateTime currentDate);
    
    /**
     * 사용자의 현재 활성 구독 멤버십 조회 (오버로드)
     */
    default List<Membership> findActiveSubscriptionsByUserId(Long userId) {
        return findActiveSubscriptionsByUserId(userId, LocalDateTime.now());
    }
    
    /**
     * 특정 멤버십에 대한 사용자의 활성 구독 여부 확인
     */
    @Query("SELECT COUNT(m) > 0 FROM Membership m WHERE m.id = :membershipId AND m.id IN (SELECT s.id FROM User u JOIN u.subscribed s WHERE u.id = :userId) AND m.status = 'ACTIVE' AND m.expiresAt > :currentDate")
    boolean existsActiveSubscriptionByUserIdAndMembershipId(@Param("userId") Long userId, @Param("membershipId") Long membershipId, @Param("currentDate") LocalDateTime currentDate);
}
