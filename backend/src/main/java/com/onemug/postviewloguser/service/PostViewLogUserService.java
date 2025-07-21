package com.onemug.postviewloguser.service;

import com.onemug.global.entity.PostViewLogUser;
import com.onemug.postviewloguser.repository.PostViewLogUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostViewLogUserService {

    private final PostViewLogUserRepository repository;

    public List<PostViewLogUser> getRecentViewedPosts(Long userId) {
        return repository.findRecentViewLogsByUserId(userId);
    }

    public void saveViewLog(Long userId, Long postId) {
        PostViewLogUser log = PostViewLogUser.builder()
                .userId(userId)
                .postId(postId)
                .viewedAt(LocalDateTime.now())
                .build();
        repository.save(log);
    }
}
