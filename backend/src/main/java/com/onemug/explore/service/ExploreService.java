// src/main/java/com/onemug/explore/service/ExploreService.java
package com.onemug.explore.service;

import com.onemug.explore.dto.ExplorePostDto;
import com.onemug.Post.repository.PostRepository;
import com.onemug.global.entity.Post;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExploreService {

    private final PostRepository postRepository;

    public Page<ExplorePostDto> getExplorePosts(Long userId, Long categoryId, Pageable pageable) {
        Page<Post> posts = Objects.isNull(categoryId)
                ? postRepository.findExplorePosts(userId, pageable)
                : postRepository.findExplorePostsByCategory(userId, categoryId, pageable);

        return posts.map(this::toDto);
    }

    private ExplorePostDto toDto(Post p) {
        return new ExplorePostDto(
                p.getId(),
                p.getTitle(),
                p.getCreator().getUser().getNickname(),
                p.getCategory().getName(),
                p.getViewCount(),
                p.getLikeCount(),
                p.getCreatedAt()
        );
    }
}
