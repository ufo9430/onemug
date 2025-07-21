package com.onemug.feed.service;

import com.onemug.feed.dto.PostDto;
import com.onemug.feed.repository.CreatorRepository;
import com.onemug.Post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FeedService {

    private final CreatorRepository creatorRepo;
    private final PostRepository    postRepo;

    public Page<PostDto> getFeed(Long userId, Pageable pageable) {

        //  구독한 Creator ID 꺼내오기
        List<Long> creatorIds = creatorRepo.findCreatorIdsBySubscriberId(userId);

        if (creatorIds.isEmpty()) {
            return Page.empty(pageable);
        }

        //  구독된 크리에이터 글 조회 후 DTO 변환
        return postRepo
                .findByCreatorIdInOrderByCreatedAtDesc(creatorIds, pageable)
                .map(p -> PostDto.builder()
                        .id(p.getId())
                        .title(p.getTitle())
                        .content(p.getContent())
                        .viewCount(p.getViewCount())
                        .likeCount(p.getLikeCount())
                        .createdAt(p.getCreatedAt())
                        .creatorNickname(p.getCreator().getUser().getNickname())
                        .build());
    }
}
