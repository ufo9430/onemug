package com.onemug.membership.service;

import com.onemug.global.dto.MembershipResponseDto;
import com.onemug.global.entity.Membership;
import com.onemug.membership.repository.MembershipRepository;
import com.onemug.membership.dto.SubscriptionHistoryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MembershipService {
    
    private final MembershipRepository membershipRepository;
    
    /**
     * 사용자의 현재 구독 멤버십 목록 조회
     */
    @Transactional(readOnly = true)
    public List<MembershipResponseDto> getMySubscriptions(Long userId) {
        List<Membership> memberships = membershipRepository.findSubscribedMembershipsByUserId(userId);
        
        return memberships.stream()
                .map(MembershipResponseDto::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 활성 구독 멤버십만 조회
     */
    @Transactional(readOnly = true)
    public List<MembershipResponseDto> getActiveSubscriptions(Long userId) {
        List<MembershipResponseDto> allSubscriptions = getMySubscriptions(userId);
        
        return allSubscriptions.stream()
                .filter(dto -> "ACTIVE".equals(dto.getStatus()))
                .collect(Collectors.toList());
    }
    
    /**
     * 구독 이력 조회
     */
    @Transactional(readOnly = true)
    public List<SubscriptionHistoryDto> getSubscriptionHistory(Long userId) {
        List<Membership> memberships = membershipRepository.findSubscribedMembershipsByUserId(userId);
        
        return memberships.stream()
                .map(this::convertToHistoryDto)
                .collect(Collectors.toList());
    }
    
    /**
     * 특정 멤버십 상세 정보 조회
     */
    @Transactional(readOnly = true)
    public Optional<MembershipResponseDto> getMembershipById(Long membershipId) {
        return membershipRepository.findById(membershipId)
                .map(MembershipResponseDto::from);
    }
    
    /**
     * 크리에이터별 멤버십 목록 조회
     */
    @Transactional(readOnly = true)
    public List<MembershipResponseDto> getMembershipsByCreator(Long creatorId) {
        List<Membership> memberships = membershipRepository.findByCreatorId(creatorId);
        
        return memberships.stream()
                .map(MembershipResponseDto::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 멤버십 검색
     */
    @Transactional(readOnly = true)
    public List<MembershipResponseDto> searchMemberships(String keyword) {
        List<Membership> memberships = membershipRepository.findByNameContainingIgnoreCase(keyword);
        
        return memberships.stream()
                .map(MembershipResponseDto::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 모든 멤버십 조회
     */
    @Transactional(readOnly = true)
    public List<MembershipResponseDto> getAllMemberships() {
        List<Membership> memberships = membershipRepository.findAllOrderByCreatedAtDesc();
        
        return memberships.stream()
                .map(MembershipResponseDto::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 멤버십을 구독 이력 DTO로 변환
     */
    private SubscriptionHistoryDto convertToHistoryDto(Membership membership) {
        if (membership == null) {
            return SubscriptionHistoryDto.builder()
                    .id(0L)
                    .membershipName("Unknown")
                    .price(0)
                    .creatorName("Unknown Creator")
                    .subscribedAt(LocalDateTime.now())
                    .expiresAt(LocalDateTime.now().plusMonths(1))
                    .paymentMethod("카드")
                    .status("ACTIVE")
                    .build();
        }
        
        return SubscriptionHistoryDto.builder()
                .id(membership.getId())
                .membershipName(membership.getName() != null ? membership.getName() : "Unknown")
                .price(membership.getPrice() != null ? membership.getPrice() : 0)
                .creatorName(membership.getCreatorName() != null ? membership.getCreatorName() : "Unknown Creator")
                .subscribedAt(membership.getSubscribedAt() != null ? membership.getSubscribedAt() : LocalDateTime.now())
                .expiresAt(membership.getExpiresAt() != null ? membership.getExpiresAt() : LocalDateTime.now().plusMonths(1))
                .paymentMethod("카드")
                .status(membership.getStatus() != null ? membership.getStatus() : "ACTIVE")
                .build();
    }
    
    /**
     * 구독 취소
     */
    public void cancelSubscription(Long membershipId, Long userId) {
        Optional<Membership> membership = membershipRepository.findById(membershipId);
        
        if (membership.isPresent()) {
            Membership membershipEntity = membership.get();
            membershipEntity.setStatus("CANCELLED");
            membershipEntity.setAutoRenew(false);
            membershipRepository.save(membershipEntity);
        } else {
            throw new RuntimeException("멤버십을 찾을 수 없습니다.");
        }
    }
}
