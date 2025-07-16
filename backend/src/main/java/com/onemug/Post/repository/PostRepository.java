package com.onemug.Post.repository;

import com.onemug.global.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    @Query("SELECT p FROM Post p WHERE p.creator.id = :creatorId ORDER BY p.createdAt desc")
    Page<Post> findByCreatorId(@Param("creatorId") Long id, Pageable pageable);
}