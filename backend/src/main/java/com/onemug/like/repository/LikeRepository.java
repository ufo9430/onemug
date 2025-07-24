package com.onemug.like.repository;

import com.onemug.global.entity.PostLike;
import com.onemug.global.entity.Post;
import com.onemug.global.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LikeRepository extends JpaRepository<PostLike, Long> {
    void deleteByUserAndPost(User user, Post post);
    boolean existsByUserIdAndPostId(Long userId, Long postId);
}
