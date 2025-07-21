package com.onemug.insight.repository;

import com.onemug.global.entity.PostViewLog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;


@Repository
public interface PostViewLogRepository extends JpaRepository<PostViewLog, Long> {
    // startDate와 creatorId를 기준으로 PostViewLog의 count를 반환하는 메서드
    @Query("SELECT COUNT (p) FROM post_view_log p WHERE p.creatorId = :creatorId AND p.viewedAt >= :startDate")
    Integer countPostViewLogsByCreatorIdAndStartDate(Long creatorId, LocalDateTime startDate);
}
