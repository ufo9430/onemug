package com.onemug.bookmark.service;

import com.onemug.bookmark.repository.PostLikeRepository;
import com.onemug.global.entity.PostLike;
import com.onemug.global.entity.User;
import com.onemug.global.entity.Post;
import com.onemug.user.repository.UserRepository;

import com.onemug.Post.repository.PostRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostLikeService {
    private final PostLikeRepository postLikeRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public void like(Long userId, Long postId) {
        User user = userRepository.findById(userId).orElseThrow();
        Post post = postRepository.findById(postId).orElseThrow();

        if (postLikeRepository.existsByUserAndPost(user, post)) return;

        postLikeRepository.save(
                PostLike.builder()
                        .user(user)
                        .post(post)
                        .likedAt(LocalDateTime.now())
                        .build()
        );
    }

    @Transactional
    public void unlike(Long userId, Long postId) {
        User user = userRepository.findById(userId).orElseThrow();
        Post post = postRepository.findById(postId).orElseThrow();
        postLikeRepository.deleteByUserAndPost(user, post);
    }

    public List<Post> getLikedPosts(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        List<PostLike> likes = postLikeRepository.findByUser(user);
        return likes.stream().map(PostLike::getPost).toList();
    }
}
