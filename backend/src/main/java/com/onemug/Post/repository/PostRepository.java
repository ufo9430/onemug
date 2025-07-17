// src/main/java/com/onemug/Post/repository/PostRepository.java
package com.onemug.Post.repository;

import com.onemug.global.entity.Post;
import com.onemug.search.dto.SearchCond;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {



    /** 창작자 본인 글 목록 (Creator dashboard) */
    @Query("""
        select p
        from Post p
        where p.creator.id = :creatorId
        order by p.createdAt desc
        """)
    Page<Post> findByCreatorId(@Param("creatorId") Long creatorId, Pageable pageable);

    /** 내가 구독한 창작자 글 – Feed 용 */
    @Query("""
        select p
        from Post p
        where p.creator.id in :creatorIds
        order by p.createdAt desc
        """)
    Page<Post> findByCreatorIdInOrderByCreatedAtDesc(@Param("creatorIds") List<Long> creatorIds,
                                                     Pageable pageable);

    /** 구독하지 않은 창작자 글 – Explore 용 */
    @Query("""
        select p
        from Post p
        join p.creator c
        left join c.subscriber s on s.id = :userId
        where s.id is null
        order by p.viewCount desc, p.createdAt desc
        """)
    Page<Post> findExplorePosts(@Param("userId") Long userId, Pageable pageable);

    /** Explore + 카테고리 필터 */
    @Query("""
        select p
        from Post p
        join p.creator c
        left join c.subscriber s on s.id = :userId
        where s.id is null
          and p.category.id = :categoryId
        order by p.viewCount desc, p.createdAt desc
        """)
    Page<Post> findExplorePostsByCategory(@Param("userId") Long userId,
                                          @Param("categoryId") Long categoryId,
                                          Pageable pageable);

    /* ────────────────────── 🔍 통합 검색 메서드 ───────────────────── */

    /**
     * FULLTEXT 통합 검색 (제목 + 내용 + 카테고리명).
     *  - MATCH(title,content) + 2×MATCH(category.name) 로 가중 정렬
     *  - 엔티티 매핑을 위해 SELECT 절은 p.* 만 남기고,
     *    점수 계산은 ORDER BY 식 안에서 수행한다.
     */
    @Query(value = """
    SELECT p.*
    FROM   post p
    JOIN   category c ON p.category_id = c.id
    WHERE  (
             MATCH(p.title, p.content) AGAINST (:#{#cond.q} IN BOOLEAN MODE)
          OR MATCH(c.name)             AGAINST (:#{#cond.q} IN BOOLEAN MODE)
          )
      AND  (
             :#{#cond.categoryIds == null || #cond.categoryIds.isEmpty()} = TRUE
          OR p.category_id IN (:#{#cond.categoryIds})
          )
    ORDER BY
          (MATCH(p.title, p.content) AGAINST (:#{#cond.q} IN BOOLEAN MODE)
         + 2 * MATCH(c.name)         AGAINST (:#{#cond.q} IN BOOLEAN MODE)) DESC,
          p.view_count DESC,
          p.created_at DESC
    """,
            countQuery = """
    SELECT COUNT(*)
    FROM   post p
    JOIN   category c ON p.category_id = c.id
    WHERE  (
             MATCH(p.title, p.content) AGAINST (:#{#cond.q} IN BOOLEAN MODE)
          OR MATCH(c.name)             AGAINST (:#{#cond.q} IN BOOLEAN MODE)
          )
      AND  (
             :#{#cond.categoryIds == null || #cond.categoryIds.isEmpty()} = TRUE
          OR p.category_id IN (:#{#cond.categoryIds})
          )
    """,
            nativeQuery = true)
    Page<Post> searchPosts(@Param("cond") SearchCond cond, Pageable pageable);

}
