package com.onemug.Post.repository;

import com.onemug.global.entity.Post;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends MongoRepository<Post, ObjectId> {
    Page<Post> findAllByUserIdOrderByCreatedAtDesc(ObjectId id, Pageable pageable);
}