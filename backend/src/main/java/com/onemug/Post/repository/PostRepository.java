package com.onemug.Post.repository;

import com.onemug.global.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findAllByUserIdOrderByCreatedAtDesc(Long id, Pageable pageable);
}