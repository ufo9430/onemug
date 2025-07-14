package com.onemug.Post.repository;

import com.onemug.global.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends MongoRepository<Post, Long> {
    Page<Post> findAllByUserIdOrderByCreatedAtDesc(Pageable pageable, Long id);
}