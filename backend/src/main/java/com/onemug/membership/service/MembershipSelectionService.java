package com.onemug.membership.service;

import com.onemug.global.entity.Benefit;
import com.onemug.global.entity.Membership;
import com.onemug.global.entity.MembershipSelection;
import com.onemug.global.entity.User;
import com.onemug.membership.dto.*;
import com.onemug.membership.repository.MembershipRepository;
import com.onemug.membership.repository.MembershipSelectionRepository;
import com.onemug.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MembershipSelectionService {
    
    private final MembershipSelectionRepository membershipSelectionRepository;
    private final MembershipRepository membershipRepository;
    private final UserRepository userRepository;
    
    /**
     * 멤버십 선택 처리
     */
    public MembershipSelectionResponseDto selectMembership(MembershipSelectionRequestDto request) {
        // 1. 유효성 검증
        MembershipValidationDto validation = validateMembershipSelection(request);
        if (!validation.isValid()) {
            return MembershipSelectionResponseDto.builder()
                    .status("ERROR")
                    .message(validation.getErrorMessage())
                    .build();
        }
        
        // 2. 사용자 및 멤버십 조회
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        Membership membership = membershipRepository.findById(request.getMembershipId())
                .orElseThrow(() -> new RuntimeException("멤버십을 찾을 수 없습니다."));
        
        // 3. 기존 활성 선택이 있다면 취소
        cancelActiveSelections(user);
        
        // 4. 새로운 선택 생성
        String selectionId = UUID.randomUUID().toString();
        MembershipSelection selection = MembershipSelection.builder()
                .selectionId(selectionId)
                .user(user)
                .membership(membership)
                .autoRenew(request.getAutoRenew())
                .paymentMethod(request.getPaymentMethod())
                .build();
        
        membershipSelectionRepository.save(selection);
        
        // 5. 응답 생성
        return convertToResponseDto(selection);
    }
    
    /**
     * 선택 ID로 선택 정보 조회
     */
    @Transactional(readOnly = true)
    public Optional<MembershipSelectionResponseDto> getSelectionById(String selectionId) {
        return membershipSelectionRepository.findBySelectionId(selectionId)
                .map(this::convertToResponseDto);
    }
    
    /**
     * 선택 확인 처리
     */
    public MembershipSelectionResponseDto confirmSelection(String selectionId) {
        MembershipSelection selection = membershipSelectionRepository.findBySelectionId(selectionId)
                .orElseThrow(() -> new RuntimeException("선택 정보를 찾을 수 없습니다."));
        
        if (selection.isExpired()) {
            selection.setStatus(MembershipSelection.SelectionStatus.EXPIRED);
            membershipSelectionRepository.save(selection);
            throw new RuntimeException("선택이 만료되었습니다. 다시 선택해주세요.");
        }
        
        selection.setStatus(MembershipSelection.SelectionStatus.CONFIRMED);
        membershipSelectionRepository.save(selection);
        
        return convertToResponseDto(selection);
    }
    
    /**
     * 멤버십 선택 유효성 검증
     */
    private MembershipValidationDto validateMembershipSelection(MembershipSelectionRequestDto request) {
        // 1. 사용자 존재 확인
        User user = userRepository.findById(request.getUserId()).orElse(null);
        if (user == null) {
            return MembershipValidationDto.error("USER_NOT_FOUND", "사용자를 찾을 수 없습니다.");
        }
        
        // 2. 멤버십 존재 확인
        Membership membership = membershipRepository.findById(request.getMembershipId()).orElse(null);
        if (membership == null) {
            return MembershipValidationDto.error("MEMBERSHIP_NOT_FOUND", "멤버십을 찾을 수 없습니다.");
        }
        
        // 3. 중복 구독 확인
        boolean isDuplicate = checkDuplicateSubscription(user, membership);
        if (isDuplicate) {
            return MembershipValidationDto.error("DUPLICATE_SUBSCRIPTION", "이미 구독 중인 멤버십입니다.");
        }
        
        // 4. 사용자 계정 상태 확인 (추후 구현)
        // TODO: 사용자 계정 정지, 제재 상태 확인
        
        return MembershipValidationDto.success();
    }
    
    /**
     * 중복 구독 확인
     */
    private boolean checkDuplicateSubscription(User user, Membership membership) {
        // 현재 활성 구독 중인지 확인
        List<Membership> activeSubscriptions = membershipRepository.findActiveSubscriptionsByUserId(user.getId());
        return activeSubscriptions.stream()
                .anyMatch(sub -> sub.getId().equals(membership.getId()));
    }
    
    /**
     * 사용자의 활성 선택들 취소
     */
    private void cancelActiveSelections(User user) {
        List<MembershipSelection> activeSelections = membershipSelectionRepository
                .findActiveSelectionsByUser(user, LocalDateTime.now());
        
        activeSelections.forEach(selection -> {
            selection.setStatus(MembershipSelection.SelectionStatus.CANCELLED);
        });
        
        membershipSelectionRepository.saveAll(activeSelections);
    }
    
    /**
     * 엔티티를 DTO로 변환
     */
    private MembershipSelectionResponseDto convertToResponseDto(MembershipSelection selection) {
        List<String> benefits = selection.getMembership().getBenefitList().stream()
                .map(Benefit::getContent)
                .collect(Collectors.toList());

        // 현재 구독 중인 멤버십 정보 (예시: selection.getUser().getSubscribed() 중 ACTIVE)
        MembershipSelectionResponseDto.CurrentSubscribedMembershipDto currentSubscribed =
                (selection.getUser() != null && selection.getUser().getSubscribed() != null)
                        ? selection.getUser().getSubscribed().stream()
                        .filter(m -> m.getStatus() != null && m.getStatus().equals("ACTIVE"))
                        .findFirst()
                        .map(m -> MembershipSelectionResponseDto.CurrentSubscribedMembershipDto.builder()
                                .id(m.getId())
                                .name(m.getName())
                                .price(m.getPrice())
                                .status(m.getStatus())
                                .build())
                        .orElse(null)
                        : null;

        // 무료/유료 플랜 여부
        boolean isFree = selection.getMembership().getPrice() == null || selection.getMembership().getPrice() == 0;

        // 다음 단계 결정
        String nextStep = isFree ? "COMPLETE" : "PAYMENT";

        log.info("creator={}", selection.getMembership().getCreator());

        return MembershipSelectionResponseDto.builder()
                .selectionId(selection.getSelectionId())
                .membershipId(selection.getMembership().getId())
                .membershipName(selection.getMembership().getName())
                .price(selection.getMembership().getPrice())
                .creatorName(selection.getMembership().getCreatorName())
                .benefits(benefits)
                .autoRenew(selection.getAutoRenew())
                .paymentMethod(selection.getPaymentMethod())
                .expiresAt(selection.getExpiresAt())
                .status(selection.getStatus().name())
                .message(isFree ? "무료 플랜입니다. 즉시 가입 가능합니다." : "유료 플랜입니다. 결제 후 이용 가능합니다.")
                .currentSubscribedMembership(currentSubscribed)
                .isFree(isFree)
                .nextStep(nextStep)
                .build();
    }
}
