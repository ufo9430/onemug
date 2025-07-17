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

@Repository
public interface CreatorRepository extends JpaRepository<Creator, Long> {

    /** 내가 구독한 Creator id 목록 */
    @Query("""
        select c.id
        from Creator c
        join c.subscriber s
        where s.id = :userId
    """)
    List<Long> findCreatorIdsBySubscriberId(@Param("userId") Long userId);

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
}