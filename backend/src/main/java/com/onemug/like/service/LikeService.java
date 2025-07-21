package com.onemug.like.service;

import com.onemug.Post.repository.PostRepository;
import com.onemug.global.entity.LikeId;
import com.onemug.global.entity.Post;
import com.onemug.global.entity.PostLike;
import com.onemug.global.entity.User;
import com.onemug.like.repository.LikeRepository;
import com.onemug.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LikeService {
    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public int likePost(Long postId, Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        Post post = postRepository.findById(postId).orElseThrow();
        post.incrementLikeCount();

        likeRepository.save(PostLike.builder()
                        .id(new LikeId(user.getId(), post.getId()))
                        .user(user)
                        .post(post)
                        .likedAt(LocalDateTime.now())
                        .build()
        );

        return post.getLikeCount();
    }

    @Transactional
    public int dislikePost(Long postId, Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        Post post = postRepository.findById(postId).orElseThrow();
        post.decrementLikeCount();
        likeRepository.deleteByUserAndPost(user, post);

        return post.getLikeCount();
    }
}
