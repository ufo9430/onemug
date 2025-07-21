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
import java.util.Set;

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
    Page<Post> findByCreatorIdInOrderByCreatedAtDesc(
            @Param("creatorIds") List<Long> creatorIds,
            Pageable pageable
    );

    /** ─── Explore: 본인 글만 제외 (구독자 없음) ─── */
    Page<Post> findAllByCreatorIdNot(Long creatorId, Pageable pageable);
    Page<Post> findAllByCreatorIdNotAndCategoryId(Long creatorId, Long categoryId, Pageable pageable);

    /** ─── Explore: 본인 + 구독자 글 제외 (구독자 있음, 전체) ─── */
    @Query("""
        select p
        from Post p
        where p.creator.id <> :userId
          and p.creator.id not in :subscribedCreatorIds
        order by p.viewCount desc, p.createdAt desc
    """)
    Page<Post> findExplorePosts(
            @Param("userId") Long userId,
            @Param("subscribedCreatorIds") List<Long> subscribedCreatorIds,
            Pageable pageable
    );

    /** ─── Explore: 본인 + 구독자 글 제외 (구독자 있음, 카테고리 필터) ─── */
    @Query("""
        select p
        from Post p
        where p.creator.id <> :userId
          and p.creator.id not in :subscribedCreatorIds
          and p.category.id = :categoryId
        order by p.viewCount desc, p.createdAt desc
    """)
    Page<Post> findExplorePostsByCategory(
            @Param("userId") Long userId,
            @Param("subscribedCreatorIds") List<Long> subscribedCreatorIds,
            @Param("categoryId") Long categoryId,
            Pageable pageable
    );

    /* ────────────────────── 🔍 FULLTEXT + LIKE 페일백 통합 검색 ───────────────────── */
    @Query(value = """
    SELECT p.*
    FROM   post p
    JOIN   category c ON p.category_id = c.id
    WHERE  (
             MATCH(p.title, p.content) AGAINST (:q IN BOOLEAN MODE)
          OR MATCH(c.name)             AGAINST (:q IN BOOLEAN MODE)
          OR p.title   LIKE CONCAT('%', :q, '%')
          OR p.content LIKE CONCAT('%', :q, '%')
          )
      AND  (
             :categoryIds IS NULL
          OR p.category_id IN (:categoryIds)
          )
    ORDER BY p.view_count DESC, p.created_at DESC
    """,
            countQuery = """
    SELECT COUNT(*)
    FROM   post p
    JOIN   category c ON p.category_id = c.id
    WHERE  (
             MATCH(p.title, p.content) AGAINST (:q IN BOOLEAN MODE)
          OR MATCH(c.name)             AGAINST (:q IN BOOLEAN MODE)
          OR p.title   LIKE CONCAT('%', :q, '%')
          OR p.content LIKE CONCAT('%', :q, '%')
          )
      AND  (
             :categoryIds IS NULL
          OR p.category_id IN (:categoryIds)
          )
    """,
            nativeQuery = true)
    Page<Post> searchPosts(
            @Param("q") String q,
            @Param("categoryIds") List<Long> categoryIds,
            Pageable pageable
    );



}
