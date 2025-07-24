package com.onemug.feed.repository;

import com.onemug.global.entity.Creator;
import com.onemug.search.dto.SearchCond;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CreatorRepository extends JpaRepository<Creator, Long> {

    /** 내가 구독한 Creator id 목록 */
    @Query("""
    select distinct m.creator.id
    from Membership m
    where m.user.id = :userId
      and m.isTemplate = false
      and m.status = 'ACTIVE'
      and (m.expiresAt is null or m.expiresAt > CURRENT_TIMESTAMP)
""")
    List<Long> findActiveCreatorIdsByUserId(@Param("userId") Long userId);

    /** Creator 통합 검색 (닉네임·소개글) */
    @Query(value = """
    SELECT cr.*
    FROM   creator cr
    JOIN   `user` u ON cr.user_id = u.id
    WHERE  (
             MATCH(u.nickname)           AGAINST (:#{#cond.q} IN BOOLEAN MODE)
          OR MATCH(cr.introduce_text)     AGAINST (:#{#cond.q} IN BOOLEAN MODE)
          )
    """, nativeQuery = true)
    Page<Creator> searchCreators(@Param("cond") SearchCond cond, Pageable pageable);

    Optional<Creator> findByUserId(Long userId);
}

