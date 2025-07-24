package com.onemug.bookmark.repository;

import com.onemug.global.entity.PostLike;
import com.onemug.global.entity.PostLikeId;
import com.onemug.global.entity.User;
import com.onemug.global.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostLikeRepository extends JpaRepository<PostLike, PostLikeId> {
    List<PostLike> findByUser(User user);
    boolean existsByUserAndPost(User user, Post post);
    void deleteByUserAndPost(User user, Post post);
}
