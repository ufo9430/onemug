package com.onemug.dashboard.service;

import com.onemug.dashboard.dto.CreatorMembershipResponseDTO;
import com.onemug.feed.repository.CreatorRepository;
import com.onemug.global.entity.Benefit;
import com.onemug.global.entity.Creator;
import com.onemug.global.entity.Membership;
import com.onemug.membership.repository.MembershipRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardMembershipService {
    @Autowired
    private CreatorRepository creatorRepository;

    @Autowired
    private MembershipRepository membershipRepository;

    //내 멤버십 조회
    public List<CreatorMembershipResponseDTO> browseMemberships(Long userId) {
        List<CreatorMembershipResponseDTO> dtoList = new ArrayList<>();

        Creator creator = creatorRepository.findByUserId(userId).orElseThrow(EntityNotFoundException::new);

        List<Membership> byCreatorId = membershipRepository.findAllByCreatorIdAndIsTemplateTrue(creator.getId());

        for (Membership membership : byCreatorId) {
            List<Benefit> benefits = membership.getBenefits();
            Map<Long, String> benefitMap = new HashMap<>();
            for (Benefit benefit : benefits) {
                benefitMap.put(benefit.getId(), benefit.getContent());
            }
            CreatorMembershipResponseDTO dto = CreatorMembershipResponseDTO.builder()
                    .membershipId(membership.getId())
                    .name(membership.getMembershipName())
                    .price(membership.getPrice())
                    .benefits(benefitMap)
                    .build();

            dtoList.add(dto);
        }

        return dtoList;
    }
    //내 멤버십 추가

    //내 멤버십 삭제

}
