package com.onemug.Post.repository;

import com.onemug.global.entity.Post;
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
}
