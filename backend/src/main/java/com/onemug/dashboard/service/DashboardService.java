package com.onemug.dashboard.service;

import com.onemug.Post.repository.PostRepository;
import com.onemug.dashboard.dto.DashboardProfileResponseDto;
import com.onemug.feed.repository.CreatorRepository;
import com.onemug.global.entity.Creator;
import com.onemug.global.entity.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor

public class DashboardService {

    private final CreatorRepository creatorRepository;
    private final PostRepository postRepository; // 게시글 수
    private final EntityManager em;

    public DashboardProfileResponseDto findById(Long userId) {
        Creator creator = creatorRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("크리에이터 계정이 존재하지 않습니다."));

        User user = creator.getUser();

        Long subscriberCount = countSubscribers(creator.getId());
        Long postCount = postRepository.countByCreatorId(creator.getId());

        return DashboardProfileResponseDto.builder()
                .creatorId(creator.getId())
                .introduceText(creator.getIntroduceText())
                .userId(user.getId())
                .nickname(user.getNickname())
                .profileUrl(user.getProfileUrl())
                .subscriberCount(subscriberCount)
                .postCount(postCount)
                .build();
    }

    public Long countSubscribers(Long creatorId) {
        String sql = "SELECT COUNT(*) FROM creator_subscriber WHERE creator_id = ?";
        Object result = em.createNativeQuery(sql)
                .setParameter(1, creatorId)
                .getSingleResult();

        return (Long) result;
    }
}
