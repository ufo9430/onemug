package com.onemug.managesubscriber.service;

import com.onemug.feed.repository.CreatorRepository;
import com.onemug.global.entity.Creator;
import com.onemug.global.entity.Membership;
import com.onemug.global.entity.User;
import com.onemug.managesubscriber.dto.SubscribersResponseDTO;
import com.onemug.membership.repository.MembershipRepository;
import com.onemug.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ManageSubscriberService {
    @Autowired
    private CreatorRepository creatorRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MembershipRepository membershipRepository;

    public List<SubscribersResponseDTO> getSubscribers(Long userId){
        List<SubscribersResponseDTO> dtoList = new ArrayList<>();
        Creator creator = creatorRepository.findByUserId(userId).orElseThrow(EntityNotFoundException::new);

        Long creatorId = creator.getId();
        List<User> subscriber = creator.getSubscriber();

        for (User user : subscriber) {
            List<Membership> activeSubscriptionsByUserId = membershipRepository.findActiveSubscriptionsByUserId(userId, LocalDateTime.now());
            LocalDateTime joinDate = null;
            String membershipType = null;

            for (Membership membership : activeSubscriptionsByUserId) {
                Long id = membership.getCreator().getId();
                if(creatorId.equals(id)){
                    membershipType = membership.getMembershipName();
                    joinDate = membership.getSubscribedAt();
                    break;
                }
            }

            SubscribersResponseDTO responseDTO = SubscribersResponseDTO.builder()
                    .id(user.getId())
                    .name(user.getNickname())
                    .joinDate(joinDate)
                    .email(user.getEmail())
                    .avatarUrl(user.getProfileUrl())
                    .membershipType(membershipType)
                    .build();

            dtoList.add(responseDTO);
        }

        return dtoList;
    }
}
