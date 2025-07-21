package com.onemug.insight.repository;

import com.onemug.global.entity.Membership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MembershipHistoryRepository extends JpaRepository<Membership, Long> {

    List<Membership> findMembershipsByCreatorIdAndCreatedAtAfter(Long creatorId, LocalDateTime createdAtAfter);

    List<Membership> findMembershipsByNameAndCreatorIdAndCreatedAtAfter(String name, Long creatorId, LocalDateTime createdAtAfter);
}
