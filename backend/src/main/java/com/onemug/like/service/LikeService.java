package com.onemug.like.service;

import com.onemug.Post.repository.PostRepository;
import com.onemug.global.entity.LikeId;
import com.onemug.global.entity.Post;
import com.onemug.global.entity.PostLike;
import com.onemug.global.entity.User;
import com.onemug.like.repository.LikeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class LikeService {
    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
//    private final UserRepository userRepository;

    public LikeService(LikeRepository likeRepository, PostRepository postRepository) {
        this.likeRepository = likeRepository;
        this.postRepository = postRepository;
    }

    @Transactional
    public int likePost(Long postId/*, OAuth2User user*/) {
        //        Long userId = ((Number) user.getAttribute("userId")).longValue();
        //        User user = userRepository.findById(userId).orElseThrow();
        User user = new User(1L, "dummy", "dummy@dum.com", "dum123", "dummy.url", null);
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
    public int dislikePost(Long postId/*, OAuth2User user*/) {
        //        Long userId = ((Number) user.getAttribute("userId")).longValue();
        //        User user = userRepository.findById(userId).orElseThrow();
        User user = new User(1L, "dummy", "dummy@dum.com", "dum123", "dummy.url", null);
        Post post = postRepository.findById(postId).orElseThrow();
        post.decrementLikeCount();
        likeRepository.deleteByUserAndPost(user, post);

        return post.getLikeCount();
    }
}
