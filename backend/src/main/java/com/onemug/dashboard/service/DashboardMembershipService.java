package com.onemug.dashboard.service;

import com.onemug.dashboard.dto.CreatorMembershipRequestDTO;
import com.onemug.dashboard.dto.CreatorMembershipResponseDTO;
import com.onemug.feed.repository.CreatorRepository;
import com.onemug.global.entity.Benefit;
import com.onemug.global.entity.Creator;
import com.onemug.global.entity.Membership;
import com.onemug.membership.repository.MembershipRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

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
            List<String> benefitList = new ArrayList<>();
            for (Benefit benefit : benefits) {
                benefitList.add(benefit.getContent());
            }
            CreatorMembershipResponseDTO dto = CreatorMembershipResponseDTO.builder()
                    .id(membership.getId())
                    .name(membership.getMembershipName())
                    .price(membership.getPrice())
                    .benefits(benefitList)
                    .build();

            dtoList.add(dto);
        }

        return dtoList;
    }
    //내 멤버십 추가

    public CreatorMembershipResponseDTO addMembership(CreatorMembershipRequestDTO requestDTO,
                                                      Long userId){
        Creator creator = creatorRepository.findByUserId(userId).orElseThrow(EntityNotFoundException::new);

        Membership newMembership = Membership.builder()
                .creator(creator)
                .status(Membership.SubscriptionStatus.ACTIVE)
                .price(requestDTO.getPrice())
                .membershipName(requestDTO.getName())
                .autoRenew(false)
                .isTemplate(true)
                .build();

        //benefits
        List<Benefit> benefits = new ArrayList<>();
        for (String benefitStr : requestDTO.getBenefits()) {
            Benefit benefit = Benefit.builder()
                    .membership(newMembership)
                    .content(benefitStr)
                    .build();
            benefits.add(benefit);
        }

        membershipRepository.save(newMembership);

        return CreatorMembershipResponseDTO.builder()
                .id(newMembership.getId())
                .name(newMembership.getMembershipName())
                .price(newMembership.getPrice())
                .benefits(requestDTO.getBenefits())
                .build();
    }
    //내 멤버십 삭제

    public boolean deleteMembership(Long userId, Long membershipId){
        Creator creator = creatorRepository.findByUserId(userId).orElseThrow(EntityNotFoundException::new);
        Membership membership = membershipRepository.findById(membershipId).orElseThrow(EntityNotFoundException::new);

        if(!membership.getCreator().equals(creator)){
            return false;
        }

        membershipRepository.delete(membership);
        return true;
    }

}
