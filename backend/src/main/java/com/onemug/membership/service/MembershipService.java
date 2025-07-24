package com.onemug.membership.service;

import com.onemug.global.entity.Membership;
import com.onemug.global.entity.User;
import com.onemug.global.entity.Creator;
import com.onemug.membership.dto.*;
import com.onemug.global.dto.MembershipResponseDto;
import com.onemug.membership.repository.MembershipRepository;
import com.onemug.newcreator.repository.CreatorRegisterRepository;
import com.onemug.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Membership 기반의 새로운 구독 관리 서비스
 * 기존 MembershipService를 Membership 엔티티 기반으로 리팩토링
 */
@Service
@RequiredArgsConstructor
public class MembershipService {
    
    // Lombok @Slf4j 우회용 수동 Logger (컴파일 문제 해결)
    private static final Logger log = LoggerFactory.getLogger(MembershipService.class);
    
    private final MembershipRepository membershipRepository;
    private final UserRepository userRepository;
    private final CreatorRegisterRepository creatorRepository;
    
    // === 사용자 구독 조회 ===
    
    /**
     * 사용자의 모든 구독 목록 조회
     */
    public List<MembershipResponseDto> getMySubscriptions(Long userId) {
        try {
            log.info("=== 구독 목록 조회 시작: userId={} ===", userId);
            
            List<Membership> subscriptions = membershipRepository
                    .findByUserIdOrderByCreatedAtDesc(userId);
            
            log.info("조회된 구독 수: {}", subscriptions.size());
            
            // 각 구독 정보 상세 로그
            for (int i = 0; i < subscriptions.size(); i++) {
                Membership m = subscriptions.get(i);
                log.info("구독 {}: ID={}, Name='{}', UserId={}, IsTemplate={}, Status={}", 
                        i+1, m.getId(), m.getMembershipName(), 
                        m.getUser() != null ? m.getUser().getId() : "NULL", 
                        m.getIsTemplate(), m.getStatus());
            }
            
            List<MembershipResponseDto> result = subscriptions.stream()
                    .map(MembershipResponseDto::from)
                    .collect(Collectors.toList());
            
            log.info("변환된 DTO 수: {}", result.size());
            
            // DTO 변환 결과도 로그로 확인
            for (int i = 0; i <result.size(); i++) {
                MembershipResponseDto dto = result.get(i);
                log.info("DTO {}: ID={}, Name='{}', Price={}, CreatorName='{}'", 
                        i+1, dto.getId(), dto.getMembershipName(), 
                        dto.getPrice(), dto.getCreatorName());
            }
            
            log.info("=== 구독 목록 조회 완료 ===");
            return result;
                
        } catch (Exception e) {
            log.error("사용자 구독 목록 조회 중 오류 발생: userId={}", userId, e);
            return List.of();
        }
    }
    
    /**
     * 활성 멤버십만 조회
     */
    public List<MembershipResponseDto> getActiveSubscriptions(Long userId) {
        try {
            List<Membership> activeSubscriptions = membershipRepository
                    .findActiveSubscriptionsByUserId(userId, LocalDateTime.now());
            
            log.info("사용자 {} 활성 구독 조회: {}건", userId, activeSubscriptions.size());
            
            return activeSubscriptions.stream()
                    .map(MembershipResponseDto::from)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("활성 구독 조회 중 오류 발생: userId={}", userId, e);
            return List.of();
        }
    }
    
    /**
     * 구독 이력 조회
     */
    public List<SubscriptionHistoryDto> getSubscriptionHistory(Long userId) {
        try {
            List<Membership> subscriptions = membershipRepository
                    .findByUserIdOrderByCreatedAtDesc(userId);
            
            return subscriptions.stream()
                    .map(this::convertToHistoryDto)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("구독 이력 조회 중 오류 발생: userId={}", userId, e);
            return List.of();
        }
    }
    
    /**
     * 특정 멤버십 상세 조회
     */
    public MembershipResponseDto getMembershipDetails(Long membershipId) {
        try {
            Optional<Membership> membership = membershipRepository.findById(membershipId);
            
            if (membership.isPresent()) {
                log.info("멤버십 상세 조회 성공: membershipId={}", membershipId);
                return MembershipResponseDto.from(membership.get());
            } else {
                log.warn("멤버십을 찾을 수 없습니다: membershipId={}", membershipId);
                return null;
            }
            
        } catch (Exception e) {
            log.error("멤버십 상세 조회 중 오류 발생: membershipId={}", membershipId, e);
            return null;
        }
    }
    
    // === 창작자별 구독 조회 ===
    
    /**
     * 특정 창작자의 구독자 목록 조회
     */
    public List<MembershipResponseDto> getSubscribersByCreator(Long creatorId) {
        try {
            List<Membership> subscribers = membershipRepository
                    .findActiveSubscriptionsByCreatorId(creatorId, LocalDateTime.now());
            
            log.info("창작자 {} 구독자 목록 조회: {}건", creatorId, subscribers.size());
            
            return subscribers.stream()
                    .map(MembershipResponseDto::from)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("창작자 구독자 목록 조회 중 오류 발생: creatorId={}", creatorId, e);
            return List.of();
        }
    }
    
    /**
     * 특정 창작자의 구독 목록 조회 (컨트롤러 호환)
     */
    public List<MembershipResponseDto> getSubscriptionsByCreator(Long creatorId) {
        return getSubscribersByCreator(creatorId);
    }
    
    /**
     * 창작자의 구독자 수 조회
     */
    public Long getSubscriberCount(Long creatorId) {
        try {
            Long count = membershipRepository
                    .countActiveSubscribersByCreatorId(creatorId, LocalDateTime.now());
            
            log.info("창작자 {} 구독자 수: {}명", creatorId, count);
            return count;
            
        } catch (Exception e) {
            log.error("창작자 구독자 수 조회 중 오류 발생: creatorId={}", creatorId, e);
            return 0L;
        }
    }
    
    /**
     * 활성 구독자 수 조회 (컨트롤러 호환)
     */
    public long getActiveSubscriberCount(Long creatorId) {
        Long count = getSubscriberCount(creatorId);
        return count != null ? count : 0L;
    }
    
    /**
     * 창작자의 월 매출 조회
     */
    public Long getMonthlyRevenue(Long creatorId) {
        try {
            List<Membership> activeSubscriptions = membershipRepository
                    .findActiveSubscriptionsByCreatorId(creatorId, LocalDateTime.now());
            
            Long revenue = activeSubscriptions.stream()
                    .mapToLong(subscription -> subscription.getPrice() != null ? subscription.getPrice() : 0L)
                    .sum();
            
            log.info("창작자 {} 월 매출: {}원", creatorId, revenue);
            return revenue;
            
        } catch (Exception e) {
            log.error("창작자 월 매출 조회 중 오류 발생: creatorId={}", creatorId, e);
            return 0L;
        }
    }
    
    /**
     * 사용자가 특정 창작자의 활성 구독을 가지고 있는지 확인
     */
    public boolean hasActiveSubscriptionForCreator(Long userId, Long creatorId) {
        try {
            List<Membership> activeSubscriptions = membershipRepository
                    .findActiveSubscriptionsByUserId(userId, LocalDateTime.now());
            
            boolean hasSubscription = activeSubscriptions.stream()
                    .anyMatch(subscription -> subscription.getCreator().getId().equals(creatorId));
            
            log.info("사용자 {} 창작자 {} 활성 구독 여부: {}", userId, creatorId, hasSubscription);
            return hasSubscription;
            
        } catch (Exception e) {
            log.error("활성 구독 여부 확인 중 오류 발생: userId={}, creatorId={}", userId, creatorId, e);
            return false;
        }
    }
    
    /**
     * 전체 활성 구독 수 조회
     */
    public long getTotalActiveSubscriptions() {
        try {
            long count = membershipRepository.countActiveSubscriptions(LocalDateTime.now());
            log.info("전체 활성 구독 수: {}건", count);
            return count;
            
        } catch (Exception e) {
            log.error("전체 활성 구독 수 조회 중 오류 발생", e);
            return 0L;
        }
    }
    
    /**
     * 멤버십별 구독 통계 조회
     */
    public List<Object[]> getMembershipSubscriptionStats() {
        try {
            List<Object[]> stats = membershipRepository.getMembershipSubscriptionStats();
            log.info("멤버십 구독 통계 조회: {}건", stats.size());
            return stats;
            
        } catch (Exception e) {
            log.error("멤버십 구독 통계 조회 중 오류 발생", e);
            return List.of();
        }
    }
    
    /**
     * 가격대별 분포 조회
     */
    public List<Object[]> getPriceDistribution() {
        try {
            List<Object[]> distribution = membershipRepository.getPriceDistribution();
            log.info("가격대별 분포 조회: {}건", distribution.size());
            return distribution;
            
        } catch (Exception e) {
            log.error("가격대별 분포 조회 중 오류 발생", e);
            return List.of();
        }
    }
    
    /**
     * 구독 연장
     */
    @Transactional
    public void extendSubscription(Long subscriptionId, int months) {
        try {
            Optional<Membership> membershipOpt = membershipRepository.findById(subscriptionId);
            
            if (membershipOpt.isEmpty()) {
                throw new RuntimeException("멤버십을 찾을 수 없습니다.");
            }
            
            Membership membership = membershipOpt.get();
            membership.extendSubscription(months);
            membershipRepository.save(membership);
            
            log.info("구독 연장 완료: membershipId={}, 연장기간={}개월", subscriptionId, months);
            
        } catch (Exception e) {
            log.error("구독 연장 중 오류 발생: membershipId={}", subscriptionId, e);
            throw new RuntimeException("구독 연장에 실패했습니다: " + e.getMessage());
        }
    }
    
    /**
     * 구독 ID로 조회 (컨트롤러 호환)
     */
    public Optional<MembershipResponseDto> getSubscriptionById(Long subscriptionId) {
        try {
            Optional<Membership> membership = membershipRepository.findById(subscriptionId);
            
            if (membership.isPresent()) {
                log.info("구독 조회 성공: subscriptionId={}", subscriptionId);
                return Optional.of(MembershipResponseDto.from(membership.get()));
            } else {
                log.warn("구독을 찾을 수 없습니다: subscriptionId={}", subscriptionId);
                return Optional.empty();
            }
            
        } catch (Exception e) {
            log.error("구독 조회 중 오류 발생: subscriptionId={}", subscriptionId, e);
            return Optional.empty();
        }
    }
    
    // === 플랜 템플릿 관리 ===

    /**
     * 모든 플랜 템플릿 조회
     */
    public List<MembershipResponseDto> getAllTemplates() {
        try {
            List<Membership> templates = membershipRepository.findAllTemplates();
            
            log.info("전체 템플릿 조회: {}건", templates.size());
            
            // Benefits 상세 로그 추가
            templates.forEach(template -> {
                log.info("템플릿 '{}' - Benefits 수: {}", 
                    template.getMembershipName(), 
                    template.getBenefits() != null ? template.getBenefits().size() : "NULL");
                
                if (template.getBenefits() != null) {
                    template.getBenefits().forEach(benefit -> 
                        log.info("  - Benefit: '{}'", benefit.getContent())
                    );
                }
            });
            
            return templates.stream()
                    .map(MembershipResponseDto::from)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("전체 템플릿 조회 중 오류 발생", e);
            return List.of();
        }
    }

    /**
     * 창작자별 플랜 템플릿 조회
     */
    public List<MembershipResponseDto> getTemplatesByCreator(Long creatorId) {
        try {
            List<Membership> templates = membershipRepository.findTemplatesByCreatorId(creatorId);
            
            log.info("창작자 {} 템플릿 조회: {}건", creatorId, templates.size());
            
            // Benefits 상세 로그 추가
            templates.forEach(template -> {
                log.info("템플릿 '{}' - Benefits 수: {}", 
                    template.getMembershipName(), 
                    template.getBenefits() != null ? template.getBenefits().size() : "NULL");
                
                if (template.getBenefits() != null) {
                    template.getBenefits().forEach(benefit -> 
                        log.info("  - Benefit: '{}'", benefit.getContent())
                    );
                }
            });
            
            return templates.stream()
                    .map(MembershipResponseDto::from)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("창작자별 플랜 템플릿 조회 중 오류 발생: creatorId={}", creatorId, e);
            return List.of();
        }
    }
    
    // === 구독 생성 및 관리 ===
    
    /**
     * 결제 완료 후 바로 ACTIVE 상태로 구독 생성
     * @param membershipId 멤버십 템플릿 ID
     * @param userId 사용자 ID
     * @param orderId 결제 주문 ID
     * @return 생성된 활성 구독의 ID
     */
    @Transactional
    public Long createActiveSubscription(Long membershipId, Long userId, String orderId) {
        try {
            log.info("결제 완료 후 활성 구독 직접 생성: membershipId={}, userId={}, orderId={}", 
                     membershipId, userId, orderId);
            
            // 1. 멤버십 템플릿 조회
            Membership template = membershipRepository.findById(membershipId)
                    .orElseThrow(() -> new IllegalArgumentException("멤버십 템플릿을 찾을 수 없습니다: " + membershipId));
                    
            if (!template.isTemplate()) {
                throw new IllegalArgumentException("멤버십 템플릿이 아닙니다: " + membershipId);
            }
            
            // 2. 사용자 조회
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + userId));
                    
            // 3. 중복 구독 확인 (창작자별로 활성 구독은 하나만 가능)
            Long creatorId = template.getCreator().getId();
            boolean hasDuplicate = checkDuplicateSubscription(user, membershipId, creatorId);
            
            if (hasDuplicate) {
                log.warn("이미 해당 창작자의 활성 구독이 있습니다: userId={}, creatorId={}", userId, creatorId);
                return null;
            }
            
            // 4. 동일 창작자의 하위 가격 구독 취소
            cancelLowerPriceSubscriptions(userId, creatorId, template.getPrice());
            
            // 5. 템플릿에서 구독 생성 - 바로 ACTIVE 상태로 설정
            Membership subscription = template.createSubscriptionFor(user);
            subscription.setStatus(Membership.SubscriptionStatus.ACTIVE);
            subscription.setOrderId(orderId);
            
            // 6. 구독 저장
            Membership savedSubscription = membershipRepository.save(subscription);
            
            log.info("활성 구독 생성 완료: id={}, 상태={}, 사용자={}, 주문ID={}",
                     savedSubscription.getId(), savedSubscription.getStatus(),
                     savedSubscription.getUser().getId(), savedSubscription.getOrderId());
                     
            return savedSubscription.getId();
            
        } catch (Exception e) {
            log.error("활성 구독 생성 중 오류 발생: membershipId={}, userId={}", membershipId, userId, e);
            return null;
        }
    }
    
    /**
     * 구독 생성 (MembershipSelection 통합)
     */
    @Transactional
    public SubscriptionCreateResponseDto createSubscription(SubscriptionCreateRequestDto request) {
        try {
            log.info("구독 생성 요청: {}", request);
            
            // 1. 사용자 확인
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + request.getUserId()));
            
            // 2. 창작자 확인
            Creator creator = creatorRepository.findById(request.getCreatorId())
                    .orElseThrow(() -> new IllegalArgumentException("창작자를 찾을 수 없습니다: " + request.getCreatorId()));
            
            // 3. 멤버십 업그레이드 처리 (새로 추가)
            if (request.getCurrentMembershipId() != null) {
                log.info("멤버십 업그레이드 요청: 현재 멤버십 ID = {}", request.getCurrentMembershipId());
                
                // 현재 구독 찾기
                Membership currentMembership = membershipRepository.findById(request.getCurrentMembershipId())
                        .orElseThrow(() -> new IllegalArgumentException("현재 멤버십을 찾을 수 없습니다: " + request.getCurrentMembershipId()));
                
                // 현재 구독이 이 사용자와 창작자의 것인지 확인
                if (!currentMembership.getUser().getId().equals(user.getId()) ||
                    !currentMembership.getCreator().getId().equals(creator.getId())) {
                    throw new IllegalArgumentException("현재 멤버십이 이 사용자와 창작자의 구독이 아닙니다.");
                }
                
                // 현재 구독 취소
                log.info("업그레이드를 위해 기존 멤버십 취소: {}", currentMembership.getId());
                currentMembership.cancel("멤버십 업그레이드");
                membershipRepository.save(currentMembership);
            }
            
            // 4. 무료/유료 플랜 판단
            boolean isFree = request.getPrice() != null && request.getPrice() == 0; // 가격이 0이면 무료
            String nextStep = isFree ? "COMPLETE" : "PAYMENT";
            
            log.info("플랜 유형 판단: price={}, isFree={}", request.getPrice(), isFree);
            
            // 5. 무료 플랜은 즉시 활성화, 유료 플랜은 결제 대기
            Membership.SubscriptionStatus initialStatus = isFree ? 
                    Membership.SubscriptionStatus.ACTIVE : Membership.SubscriptionStatus.PENDING;
            
            // 6. Membership 생성
            Membership membership = Membership.builder()
                    .user(user)
                    .creator(creator)
                    .membershipName(request.getMembershipName())
                    .price(Math.toIntExact(request.getPrice()))
                    .status(initialStatus)
                    .autoRenew(request.getAutoRenew())
                    .paymentMethod(request.getPaymentMethod())
                    .orderId(request.getOrderId())
                    .isTemplate(false)  // 실제 구독
                    .build();
            
            // 업그레이드 정보 추가
            if (request.getCurrentMembershipId() != null) {
                membership.setUpgradedFromMembershipId(request.getCurrentMembershipId());
            }
            
            Membership savedMembership = membershipRepository.save(membership);
            
            // 7. 응답 생성
            String message;
            if (request.getCurrentMembershipId() != null) {
                message = isFree ? "무료 멤버십으로 다운그레이드되었습니다." : 
                          "멤버십이 업그레이드되었습니다. " + (isFree ? "즉시 이용 가능합니다." : "결제 후 이용 가능합니다.");
            } else {
                message = isFree ? "무료 플랜입니다. 즉시 이용 가능합니다." : "유료 플랜입니다. 결제 후 이용 가능합니다.";
            }
            
            return SubscriptionCreateResponseDto.success(
                    savedMembership.getId(),
                    savedMembership.getMembershipName(),
                    savedMembership.getPrice(),
                    savedMembership.getCreatorName(),
                    List.of(), // benefits 처리 추가 필요
                    isFree,
                    nextStep,
                    message
            );
            
        } catch (Exception e) {
            log.error("구독 생성 중 오류 발생: {}", e.getMessage(), e);
            return SubscriptionCreateResponseDto.error("구독 생성에 실패했습니다: " + e.getMessage());
        }
    }
    
    /**
     * 구독 유효성 검증
     * @param request 구독 요청 정보
     * @return 검증 결과
     */
    public MembershipValidationDto validateSubscription(SubscriptionCreateRequestDto request) {
        log.info("구독 유효성 검증 시작: {}", request);
        
        // 1. 사용자 존재 확인
        User user = userRepository.findById(request.getUserId()).orElse(null);
        if (user == null) {
            log.error("사용자를 찾을 수 없습니다: userId={}", request.getUserId());
            return MembershipValidationDto.error("USER_NOT_FOUND", "사용자를 찾을 수 없습니다.");
        }
        log.info("사용자 확인 완료: {}", user.getNickname());
        
        // 2. 선택한 멤버십 정보 조회
        Membership selectedMembership = membershipRepository.findById(request.getMembershipId())
                .orElse(null);
        if (selectedMembership == null) {
            log.error("멤버십을 찾을 수 없습니다: membershipId={}", request.getMembershipId());
            return MembershipValidationDto.error("MEMBERSHIP_NOT_FOUND", "멤버십을 찾을 수 없습니다.");
        }
        
        // 3. 중복 구독 및 업그레이드 확인
        try {
            // 현재 사용자의 해당 창작자에 대한 활성 구독 확인
            List<Membership> activeSubscriptions = membershipRepository
                    .findActiveSubscriptionsByUserAndCreator(user.getId(), request.getCreatorId(), LocalDateTime.now());
            
            boolean hasActiveSubscription = !activeSubscriptions.isEmpty();
            log.info("활성 구독 여부: {}", hasActiveSubscription);
            
            // 활성 구독이 있는 경우
            if (hasActiveSubscription) {
                // 현재 구독 중인 멤버십
                Membership currentMembership = activeSubscriptions.get(0);
                log.info("현재 구독 중인 멤버십: id={}, name={}, price={}",
                        currentMembership.getId(), currentMembership.getMembershipName(), currentMembership.getPrice());
                
                // 선택한 멤버십이 무료인 경우 -> 중복 구독 불가
                if (selectedMembership.getPrice() == 0) {
                    log.warn("무료 멤버십 중복 구독 시도: userId={}, creatorId={}", user.getId(), request.getCreatorId());
                    return MembershipValidationDto.error("DUPLICATE_SUBSCRIPTION", "이미 구독 중인 멤버십입니다.");
                } 
                // 현재 구독이 무료이고 선택한 멤버십이 유료인 경우 -> 업그레이드 가능
                else if (currentMembership.getPrice() == 0 && selectedMembership.getPrice() > 0) {
                    log.info("무료 -> 유료 멤버십 업그레이드 가능: userId={}, creatorId={}, membershipId={}", 
                            user.getId(), request.getCreatorId(), request.getMembershipId());
                    return MembershipValidationDto.successWithUpgrade(currentMembership.getId());
                }
                // 현재 구독이 유료이고 선택한 멤버십도 유료인 경우 -> 업그레이드/다운그레이드 가능
                else if (currentMembership.getPrice() > 0 && selectedMembership.getPrice() > 0) {
                    log.info("유료 -> 유료 멤버십 변경 가능: userId={}, creatorId={}, membershipId={}", 
                            user.getId(), request.getCreatorId(), request.getMembershipId());
                    return MembershipValidationDto.successWithUpgrade(currentMembership.getId());
                } 
                // 그 외의 케이스 (유료 -> 무료)는 불가능
                else {
                    log.warn("유료 -> 무료 멤버십 다운그레이드 시도: userId={}, creatorId={}", 
                            user.getId(), request.getCreatorId());
                    return MembershipValidationDto.error("INVALID_DOWNGRADE", "유료 멤버십에서 무료 멤버십으로 변경할 수 없습니다.");
                }
            }
        } catch (Exception e) {
            log.error("중복 구독 확인 중 오류 발생", e);
            return MembershipValidationDto.error("VALIDATION_ERROR", "유효성 검증 중 오류가 발생했습니다.");
        }
        
        log.info("구독 유효성 검증 성공");
        return MembershipValidationDto.success();
    }
    
    /**
     * 중복 구독 확인
     * 무료 멤버십은 중복 구독 불가, 유료 멤버십은 업그레이드 가능
     */
    private boolean checkDuplicateSubscription(User user, Long membershipId, Long creatorId) {
        if (creatorId == null) {
            log.warn("creatorId가 null입니다. 중복 구독 확인 생략");
            return false; // creatorId가 없으면 중복이 아님
        }
        
        try {
            // 1. 현재 선택한 멤버십 정보 조회
            Membership selectedMembership = membershipRepository.findById(membershipId)
                    .orElse(null);
            
            if (selectedMembership == null) {
                log.warn("존재하지 않는 멤버십: membershipId={}", membershipId);
                return false; // 존재하지 않는 멤버십이면 중복 체크 생략
            }
            
            // 2. 현재 사용자의 해당 창작자에 대한 활성 구독 조회
            boolean hasActiveSubscription = membershipRepository
                    .hasActiveSubscriptionForCreator(user.getId(), creatorId, LocalDateTime.now());
            
            // 3. 중복 구독 체크 로직
            if (hasActiveSubscription) {
                // 무료 멤버십인 경우 중복 구독 불가
                if (selectedMembership.getPrice() == 0) {
                    log.info("무료 멤버십 중복 구독 불가: userId={}, creatorId={}", 
                            user.getId(), creatorId);
                    return true; // 중복 구독으로 처리
                } else {
                    // 유료 멤버십은 업그레이드를 위해 중복 구독 허용
                    log.info("유료 멤버십 업그레이드 허용: userId={}, creatorId={}, membershipId={}", 
                            user.getId(), creatorId, membershipId);
                    return false; // 중복이 아님으로 처리하여 업그레이드 허용
                }
            }
            
            log.info("사용자 {} → 창작자 {} 활성 구독 여부: {}", 
                    user.getId(), creatorId, hasActiveSubscription);
            
            return false; // 활성 구독이 없으면 중복이 아님
            
        } catch (Exception e) {
            log.error("중복 구독 확인 중 오류: userId={}, creatorId={}", 
                    user.getId(), creatorId, e);
            return false; // 오류 발생 시 중복이 아님으로 처리
        }
    }
    
    // === DTO 변환 메서드 ===
    
    /**
     * Membership을 MembershipResponseDto로 변환
     */
    private MembershipResponseDto convertToResponseDto(Membership subscription) {
        if (subscription == null) {
            return null;
        }
        
        return MembershipResponseDto.builder()
                .id(subscription.getId())
                .name(subscription.getMembershipName())
                .price(subscription.getPrice())
                .creatorName(subscription.getCreator().getId().toString())
                .subscribedAt(subscription.getSubscribedAt())
                .expiresAt(subscription.getExpiresAt())
                .status(subscription.getStatus().name())
                .autoRenew(subscription.getAutoRenew())
                .creatorId(subscription.getCreator().getId())
                .subscriberId(subscription.getUser() != null ? subscription.getUser().getId() : null)
                .build();
    }
    
    /**
     * Membership을 SubscriptionHistoryDto로 변환
     */
    private SubscriptionHistoryDto convertToHistoryDto(Membership subscription) {
        if (subscription == null) {
            return null;
        }
        
        return SubscriptionHistoryDto.builder()
                .id(subscription.getId())
                .membershipName(subscription.getMembershipName() != null ? subscription.getMembershipName() : "Unknown")
                .price(subscription.getPrice() != null ? subscription.getPrice() : 0)
                .creatorName(subscription.getCreator().getId().toString())
                .subscribedAt(subscription.getSubscribedAt() != null ? subscription.getSubscribedAt() : LocalDateTime.now())
                .expiresAt(subscription.getExpiresAt() != null ? subscription.getExpiresAt() : LocalDateTime.now().plusMonths(1))
                .paymentMethod(subscription.getPaymentMethod() != null ? subscription.getPaymentMethod() : "카드")
                .status(subscription.getStatus() != null ? subscription.getStatus().name() : "ACTIVE")
                .autoRenew(subscription.getAutoRenew() != null ? subscription.getAutoRenew() : true)
                .build();
    }
    
    // === 구독 취소 ===
    
    /**
     * 구독 취소
     */
    @Transactional
    public SubscriptionCancelResponseDto cancelSubscription(Long membershipId) {
        try {
            Optional<Membership> membershipOpt = membershipRepository.findById(membershipId);
            
            if (membershipOpt.isEmpty()) {
                return SubscriptionCancelResponseDto.error("멤버십을 찾을 수 없습니다.", membershipId, null);
            }
            
            Membership membership = membershipOpt.get();
            
            // 이미 취소된 경우
            if (membership.getStatus() == Membership.SubscriptionStatus.CANCELLED) {
                return SubscriptionCancelResponseDto.error("이미 취소된 멤버십입니다.", membershipId, membership.getUser().getId());
            }
            
            // 이전 상태와 자동 갱신 정보 저장
            String previousStatus = membership.getStatus().name();
            boolean wasAutoRenew = membership.getAutoRenew() != null ? membership.getAutoRenew() : false;
            
            // 구독 정보 저장 (응답용)
            Long userId = membership.getUser().getId();
            String membershipName = membership.getMembershipName();
            Long creatorId = membership.getCreator().getId();
            
            // 구독 취소 처리 - 데이터베이스에서 완전히 삭제
            membershipRepository.delete(membership);
            
            log.info("구독 완전 삭제 완료: membershipId={}", membershipId);
            
            return SubscriptionCancelResponseDto.success(
                    membershipId,
                    membershipName,
                    creatorId,
                    userId,
                    previousStatus,
                    wasAutoRenew);
            
        } catch (Exception e) {
            log.error("구독 취소 중 오류 발생: membershipId={}", membershipId, e);
            return SubscriptionCancelResponseDto.error("구독 취소에 실패했습니다: " + e.getMessage(), membershipId, null);
        }
    }
    
    /**
     * 결제 완료 후 구독 상태 업데이트
     */
    @Transactional
    public boolean updateSubscriptionAfterPayment(String orderId) {
        try {
            log.info("결제 완료 후 구독 상태 업데이트 시작: orderId={}", orderId);
            
            // 주문 ID로 구독 조회
            log.info("orderId로 구독 검색: {}", orderId);
            Optional<Membership> membershipOpt = membershipRepository.findByOrderId(orderId);
            
            if (membershipOpt.isEmpty()) {
                log.warn("주문 ID에 해당하는 구독을 찾을 수 없습니다: orderId={}", orderId);
                
                // 디버깅: 모든 pending 또는 cancelled 상태의 구독 조회
                List<Membership> pendingOrCancelledMemberships = membershipRepository.findAll().stream()
                        .filter(m -> m.getStatus() == Membership.SubscriptionStatus.PENDING || 
                                     m.getStatus() == Membership.SubscriptionStatus.CANCELLED)
                        .toList();
                
                log.info("현재 PENDING 또는 CANCELLED 상태인 모든 구독 목록 ({}개):", pendingOrCancelledMemberships.size());
                pendingOrCancelledMemberships.forEach(m -> {
                    log.info("  - ID: {}, 이름: {}, 상태: {}, 주문ID: {}, 가격: {}, 사용자ID: {}", 
                            m.getId(), m.getMembershipName(), m.getStatus(), m.getOrderId(), 
                            m.getPrice(), m.getUser() != null ? m.getUser().getId() : "NULL");
                });
                
                return false;
            }
            
            Membership membership = membershipOpt.get();
            log.info("구독 찾음: id={}, status={}, name={}, price={}, orderId={}",
                    membership.getId(), membership.getStatus(), 
                    membership.getMembershipName(), membership.getPrice(), 
                    membership.getOrderId());
            
            // 결제 대기 중 또는 취소된 구독을 활성화
            if (membership.getStatus() == Membership.SubscriptionStatus.PENDING || 
                membership.getStatus() == Membership.SubscriptionStatus.CANCELLED) {
                log.info("구독 상태 업데이트 전: id={}, status={}", membership.getId(), membership.getStatus());
                
                // 구독 상태를 활성으로 변경
                Membership.SubscriptionStatus previousStatus = membership.getStatus();
                membership.setStatus(Membership.SubscriptionStatus.ACTIVE);
                membershipRepository.save(membership);
                
                log.info("구독 상태 업데이트 완료: id={}, 이전 상태={}, 새 상태=ACTIVE", 
                        membership.getId(), previousStatus);
                return true;
            } else {
                log.warn("구독이 이미 활성화되었거나 예상치 못한 상태입니다: status={}", membership.getStatus());
                return false;
            }
            
        } catch (Exception e) {
            log.error("구독 상태 업데이트 중 오류 발생: orderId={}", orderId, e);
            return false;
        }
    }
    
    /**
     * 사용자의 최신 PENDING 상태 구독을 찾아 활성화
     * 결제 완료 후 주문 ID 불일치 문제 해결을 위한 fallback 메서드
     */
    @Transactional
    public Long updateLatestPendingSubscription(Long userId, String newOrderId) {
        try {
            log.info("사용자의 최신 PENDING 구독 검색 시작: userId={}, newOrderId={}", userId, newOrderId);
            
            // 사용자 존재 확인
            User user = userRepository.findById(userId)
                    .orElse(null);
            
            if (user == null) {
                log.warn("사용자를 찾을 수 없습니다: userId={}", userId);
                return null;
            }
            
            // 해당 사용자의 모든 구독 조회
            List<Membership> userMemberships = membershipRepository.findByUserIdAndIsTemplateFalse(userId);
            
            // 최근 생성된 PENDING 상태 구독 찾기
            Optional<Membership> pendingSubscription = userMemberships.stream()
                    .filter(m -> m.getStatus() == Membership.SubscriptionStatus.PENDING)
                    .max(Comparator.comparing(Membership::getCreatedAt));
            
            // PENDING 구독이 없는 경우, 최근 생성된 CANCELLED 구독을 대신 찾아본다
            if (pendingSubscription.isEmpty()) {
                log.warn("사용자의 PENDING 상태 구독을 찾을 수 없습니다. CANCELLED 상태 최신 구독을 확인합니다: userId={}", userId);
                
                // 최근 생성된 CANCELLED 상태 구독 찾기
                pendingSubscription = userMemberships.stream()
                        .filter(m -> m.getStatus() == Membership.SubscriptionStatus.CANCELLED)
                        .max(Comparator.comparing(Membership::getCreatedAt));
                
                if (pendingSubscription.isEmpty()) {
                    log.warn("사용자의 PENDING 또는 CANCELLED 상태 구독을 찾을 수 없습니다: userId={}", userId);
                    
                    // 디버깅: 사용자의 최근 5개 구독 상태 출력
                    userMemberships.stream()
                            .sorted(Comparator.comparing(Membership::getCreatedAt).reversed())
                            .limit(5)
                            .forEach(m -> {
                                log.info("  - 최근 구독: ID={}, 상태={}, 생성일={}, 취소일={}, 가격={}원, 주문ID={}", 
                                        m.getId(), m.getStatus(), m.getCreatedAt(), 
                                        m.getCancelledAt(), m.getPrice(), m.getOrderId());
                            });
                    
                    return null;
                }
                
                log.info("CANCELLED 상태의 최신 구독을 발견했습니다. 결제 완료로 활성화를 진행합니다.");
            }
            
            Membership subscription = pendingSubscription.get();
            log.info("구독 찾음: id={}, status={}, name={}, createdAt={}, orderId={}",
                    subscription.getId(), subscription.getStatus(), 
                    subscription.getMembershipName(), subscription.getCreatedAt(), 
                    subscription.getOrderId());
            
            // 주문 ID 업데이트 및 상태 활성화
            if (subscription.getOrderId() == null || !subscription.getOrderId().equals(newOrderId)) {
                log.info("기존 주문 ID({})를 새 주문 ID({})로 업데이트합니다", subscription.getOrderId(), newOrderId);
                subscription.setOrderId(newOrderId);
            }
            
            // 구독 상태를 활성으로 변경
            subscription.setStatus(Membership.SubscriptionStatus.ACTIVE);
            membershipRepository.save(subscription);
            
            log.info("구독 활성화 완료: id={}, 이전 상태={}, 새 상태=ACTIVE, 주문ID={}", 
                    subscription.getId(), pendingSubscription.get().getStatus(), newOrderId);
            return subscription.getId();
            
        } catch (Exception e) {
            log.error("구독 활성화 중 오류 발생: userId={}", userId, e);
            return null;
        }
    }
    
    /**
     * 멤버십 ID로 Membership 엔티티 조회
     * PaymentService에서 결제 정보 저장시 사용
     */
    public Optional<Membership> getMembership(Long membershipId) {
        try {
            log.info("멤버십 엔티티 조회: membershipId={}", membershipId);
            return membershipRepository.findById(membershipId);
        } catch (Exception e) {
            log.error("멤버십 엔티티 조회 중 오류 발생: membershipId={}", membershipId, e);
            return Optional.empty();
        }
    }
    
    /**
     * 동일 창작자의 하위 가격 구독 취소
     * 상위 멤버십 구독 시 하위 멤버십은 자동으로 취소
     */
    private void cancelLowerPriceSubscriptions(Long userId, Long creatorId, Integer newSubscriptionPrice) {
        try {
            List<Membership> lowerPriceSubscriptions = membershipRepository
                .findLowerPriceActiveSubscriptions(userId, creatorId, newSubscriptionPrice);
                
            if (!lowerPriceSubscriptions.isEmpty()) {
                log.info("상위 멤버십({}원) 구독으로 하위 가격 멤버십 자동 취소: 사용자={}, 창작자={}, 취소 대상={}개",
                    newSubscriptionPrice, userId, creatorId, lowerPriceSubscriptions.size());
                
                for (Membership subscription : lowerPriceSubscriptions) {
                    log.info("하위 가격 멤버십 자동 취소: 멤버십명={}, 가격={}원, ID={}",
                        subscription.getMembershipName(), subscription.getPrice(), subscription.getId());
                    
                    // 구독 상태를 CANCELLED로 변경
                    subscription.setStatus(Membership.SubscriptionStatus.CANCELLED);
                    membershipRepository.save(subscription);
                }
            }
        } catch (Exception e) {
            log.error("하위 가격 구독 자동 취소 중 오류 발생: userId={}, creatorId={}", userId, creatorId, e);
        }
    }
}
