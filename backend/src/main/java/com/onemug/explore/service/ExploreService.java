// src/main/java/com/onemug/explore/service/ExploreService.java
package com.onemug.explore.service;

import com.onemug.explore.dto.ExplorePostDto;
import com.onemug.Post.repository.PostRepository;
import com.onemug.global.entity.Post;
import com.onemug.membership.repository.MembershipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExploreService {

    private final PostRepository postRepository;
    private final MembershipRepository membershipRepository;

    public Page<ExplorePostDto> getExplorePosts(Long userId, Long categoryId, Pageable pageable) {
        List<Long> subscribedCreatorIds = membershipRepository.findActiveCreatorIdsByUserId(userId);

        Page<Post> posts;

        if (subscribedCreatorIds == null || subscribedCreatorIds.isEmpty()) {
            // 구독자가 없으면 본인 글만 제외
            posts = Objects.isNull(categoryId)
                    ? postRepository.findAllByCreatorIdNot(userId, pageable)
                    : postRepository.findAllByCreatorIdNotAndCategoryId(userId, categoryId, pageable);
        } else {
            // 구독자가 있으면 본인+구독자 글 제외
            posts = Objects.isNull(categoryId)
                    ? postRepository.findExplorePosts(userId, subscribedCreatorIds, pageable)
                    : postRepository.findExplorePostsByCategory(userId, subscribedCreatorIds, categoryId, pageable);
        }

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

