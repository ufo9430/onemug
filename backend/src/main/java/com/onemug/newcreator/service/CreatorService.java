package com.onemug.newcreator.service;

import com.onemug.Post.repository.PostRepository;
import com.onemug.feed.repository.CreatorRepository;
import com.onemug.global.entity.Creator;
import com.onemug.global.entity.User;
import com.onemug.newcreator.dto.CreatorProfileResponseDto;
import com.onemug.newcreator.dto.CreatorUpdateDto;
import com.onemug.user.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreatorService {

    private final UserRepository userRepository;
    private final CreatorRepository creatorRepository;
    private final PostRepository postRepository; // 게시글 수
    private final EntityManager em;

    public CreatorProfileResponseDto findById(Long creatorId) {
        Creator creator = creatorRepository.findById(creatorId)
                .orElseThrow(() -> new EntityNotFoundException("해당 크리에이터가 존재하지 않습니다."));

        User user = creator.getUser();

        Long subscriberCount = countSubscribers(creatorId);
        Long postCount = postRepository.countByCreatorId(creatorId);

        return CreatorProfileResponseDto.builder()
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

    public CreatorUpdateDto findByUserId(Long userId) {
        Creator creator = creatorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("해당 userId의 Creator를 찾을 수 없습니다."));

        User user = creator.getUser();

        return CreatorUpdateDto.builder()
                .creatorId(creator.getId())
                .introduceText(creator.getIntroduceText())
                .userId(user.getId())
                .nickname(user.getNickname())
                .profileUrl(user.getProfileUrl())
                .build();
    }

    @Transactional
    public CreatorUpdateDto updateCreator(Long userId, CreatorUpdateDto dto) {
        Creator creator = creatorRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 userId의 창작자를 찾을 수 없습니다: " + userId));

        User user = creator.getUser();

        // 유저 정보 갱신
        User updatedUser = user.toBuilder()
                .nickname(dto.getNickname() != null ? dto.getNickname() : user.getNickname())
                .profileUrl(dto.getProfileUrl() != null ? dto.getProfileUrl() : user.getProfileUrl())
                .build();

        // 소개글 갱신
        if (dto.getIntroduceText() != null) {
            creator.updateIntroduceText(dto.getIntroduceText());
        }

        userRepository.save(updatedUser);  // save()는 명시적으로 저장

        return CreatorUpdateDto.builder()
                .creatorId(creator.getId())
                .introduceText(creator.getIntroduceText())
                .userId(updatedUser.getId())
                .nickname(updatedUser.getNickname())
                .profileUrl(updatedUser.getProfileUrl())
                .build();
    }

}
