package com.onemug.dashboard.service;

import com.onemug.dashboard.dto.CreatorMembershipResponseDTO;
import com.onemug.feed.repository.CreatorRepository;
import com.onemug.global.entity.Creator;
import com.onemug.global.entity.Membership;
import com.onemug.membership.repository.MembershipRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardMembershipService {
    @Autowired
    private CreatorRepository creatorRepository;

    @Autowired
    private MembershipRepository membershipRepository;

    //내 멤버십 조회
    public List<CreatorMembershipResponseDTO> browseMemberships(Long userId){
        Creator creator = creatorRepository.findByUserId(userId).orElseThrow(EntityNotFoundException::new);

        List<Membership> byCreatorId = membershipRepository.findByCreatorId(creator.getId());


    }
    //내 멤버십 추가

    //내 멤버십 삭제

}
