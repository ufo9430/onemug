package com.onemug.membership.repository;

import com.onemug.global.entity.MembershipSelection;
import com.onemug.global.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface MembershipSelectionRepository extends JpaRepository<MembershipSelection, Long> {
    
    // 선택 ID로 조회
    Optional<MembershipSelection> findBySelectionId(String selectionId);
    
    // 사용자의 활성 선택 조회 (만료되지 않은 것)
    @Query("SELECT ms FROM MembershipSelection ms WHERE ms.user = :user AND ms.status = 'PENDING' AND ms.expiresAt > :now")
    List<MembershipSelection> findActiveSelectionsByUser(@Param("user") User user, @Param("now") LocalDateTime now);
}
