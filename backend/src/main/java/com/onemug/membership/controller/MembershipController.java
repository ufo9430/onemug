package com.onemug.membership.controller;

import com.onemug.global.dto.MembershipResponseDto;
import com.onemug.membership.dto.*;
import com.onemug.membership.service.MembershipService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;
import java.util.List;
import java.util.Optional;

/**
 * 멤버십 관련 REST API 컨트롤러
 * Membership 엔티티 기반으로 리팩토링된 구독 관리 API
 */
@RestController
@RequestMapping(value = "/memberships", produces = "application/json; charset=UTF-8")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"},
        allowCredentials = "true",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
@RequiredArgsConstructor
public class MembershipController {
    
    // Lombok @Slf4j 우회용 수동 Logger (컴파일 문제 해결)
    private static final Logger log = LoggerFactory.getLogger(MembershipController.class);
    
    private final MembershipService membershipService;
    
    /**
     * 현재 사용자의 구독 멤버십 목록 조회
     * GET /memberships/my-subscriptions
     */
    @GetMapping("/my-subscriptions")
    public ResponseEntity<List<MembershipResponseDto>> getMySubscriptions(
            @RequestHeader(value = "User-Id", required = false) Long userId) {
        
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        
        List<MembershipResponseDto> subscriptions = membershipService.getMySubscriptions(userId);
        return ResponseEntity.ok(subscriptions);
    }
    
    /**
     * 활성 멤버십만 조회
     * GET /memberships/active-subscriptions
     */
    @GetMapping("/active-subscriptions")
    public ResponseEntity<List<MembershipResponseDto>> getActiveSubscriptions(
            @RequestHeader(value = "User-Id", required = false) Long userId) {
        
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        
        List<MembershipResponseDto> activeSubscriptions = membershipService.getActiveSubscriptions(userId);
        return ResponseEntity.ok(activeSubscriptions);
    }
    
    /**
     * 구독 이력 조회
     * GET /memberships/subscription-history
     */
    @GetMapping("/subscription-history")
    public ResponseEntity<List<SubscriptionHistoryDto>> getSubscriptionHistory(
            @RequestHeader(value = "User-Id", required = false) Long userId) {
        
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        
        List<SubscriptionHistoryDto> history = membershipService.getSubscriptionHistory(userId);
        return ResponseEntity.ok(history);
    }
    
    /**
     * 구독 상세 조회 (기존 membershipId → subscriptionId로 변경)
     * GET /memberships/{subscriptionId}
     */
    @GetMapping("/{subscriptionId}")
    public ResponseEntity<MembershipResponseDto> getSubscriptionById(@PathVariable Long subscriptionId) {
        
        Optional<MembershipResponseDto> subscription = membershipService.getSubscriptionById(subscriptionId);
        
        if (subscription.isPresent()) {
            return ResponseEntity.ok(subscription.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * 창작자별 구독자 목록 조회
     * GET /memberships/creator/{creatorId}
     */
    @GetMapping("/creator/{creatorId}")
    public ResponseEntity<List<MembershipResponseDto>> getSubscriptionsByCreator(@PathVariable Long creatorId) {
        
        List<MembershipResponseDto> subscriptions = membershipService.getSubscriptionsByCreator(creatorId);
        return ResponseEntity.ok(subscriptions);
    }
    
    /**
     * 특정 창작자의 멤버십 템플릿 조회 (프론트엔드 전용)
     * GET /memberships/templates/creator/{creatorId}
     */
    @GetMapping("/templates/creator/{creatorId}")
    public ResponseEntity<List<MembershipResponseDto>> getTemplatesByCreator(@PathVariable Long creatorId) {
        
        List<MembershipResponseDto> templates = membershipService.getTemplatesByCreator(creatorId);
        return ResponseEntity.ok(templates);
    }
    
    /**
     * 모든 멤버십 템플릿 조회 (프론트엔드 전용)
     * GET /memberships/templates
     */
    @GetMapping("/templates")
    public ResponseEntity<List<MembershipResponseDto>> getAllTemplates() {
        
        List<MembershipResponseDto> templates = membershipService.getAllTemplates();
        return ResponseEntity.ok(templates);
    }
    
    /**
     * 창작자의 활성 구독자 수 조회
     * GET /memberships/creator/{creatorId}/active-count
     */
    @GetMapping("/creator/{creatorId}/active-count")
    public ResponseEntity<Long> getActiveSubscriberCount(@PathVariable Long creatorId) {
        
        long count = membershipService.getActiveSubscriberCount(creatorId);
        return ResponseEntity.ok(count);
    }
    
    /**
     * 창작자의 월 수익 조회
     * GET /memberships/creator/{creatorId}/monthly-revenue
     */
    @GetMapping("/creator/{creatorId}/monthly-revenue")
    public ResponseEntity<Long> getMonthlyRevenue(@PathVariable Long creatorId) {
        
        Long revenue = membershipService.getMonthlyRevenue(creatorId);
        return ResponseEntity.ok(revenue != null ? revenue : 0L);
    }
    
    /**
     * 사용자가 특정 창작자의 활성 구독을 가지고 있는지 확인
     * GET /memberships/creator/{creatorId}/has-subscription
     */
    @GetMapping("/creator/{creatorId}/has-subscription")
    public ResponseEntity<Boolean> hasActiveSubscriptionForCreator(
            @PathVariable Long creatorId,
            @RequestHeader(value = "User-Id", required = false) Long userId) {
        
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        
        boolean hasSubscription = membershipService.hasActiveSubscriptionForCreator(userId, creatorId);
        return ResponseEntity.ok(hasSubscription);
    }
    
    /**
     * 전체 활성 구독 수 조회 (관리자용)
     * GET /memberships/total-active-count
     */
    @GetMapping("/total-active-count")
    public ResponseEntity<Long> getTotalActiveSubscriptions() {
        
        long totalCount = membershipService.getTotalActiveSubscriptions();
        return ResponseEntity.ok(totalCount);
    }
    
    /**
     * 멤버십별 구독 통계 (관리자용)
     * GET /memberships/stats/by-membership
     */
    @GetMapping("/stats/by-membership")
    public ResponseEntity<List<Object[]>> getMembershipSubscriptionStats() {
        
        List<Object[]> stats = membershipService.getMembershipSubscriptionStats();
        return ResponseEntity.ok(stats);
    }
    
    /**
     * 가격대별 구독 분포 (관리자용)
     * GET /memberships/stats/price-distribution
     */
    @GetMapping("/stats/price-distribution")
    public ResponseEntity<List<Object[]>> getPriceDistribution() {
        
        List<Object[]> distribution = membershipService.getPriceDistribution();
        return ResponseEntity.ok(distribution);
    }
    
    /**
     * 구독 유효성 검증
     * POST /memberships/validate
     * 사용자, 멤버십, 중복 구독 여부 등을 검증
     */
    @PostMapping("/validate")
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"})
    public ResponseEntity<?> validateSubscription(
            @RequestBody SubscriptionCreateRequestDto requestDto,
            @RequestParam(required = false) Long userId) {
        
        log.info("구독 유효성 검증 요청: {}, userId={}", requestDto, userId);
        
        // userId 파라미터가 있으면 요청 객체에 설정
        if (userId != null) {
            requestDto.setUserId(userId);
        }
        
        // 서비스 호출하여 유효성 검증
        MembershipValidationDto result = membershipService.validateSubscription(requestDto);
        log.info("구독 유효성 검증 결과: {}", result);
        
        if (result.isValid()) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }
    
    /**
     * 구독 취소
     * DELETE /memberships/{subscriptionId}/cancel
     */
    @DeleteMapping(value = "/{subscriptionId}/cancel", produces = "application/json; charset=UTF-8")
    public ResponseEntity<SubscriptionCancelResponseDto> cancelSubscription(
            @PathVariable Long subscriptionId,
            @RequestHeader(value = "User-Id", required = false) Long userId) {
        
        if (userId == null) {
            SubscriptionCancelResponseDto errorResponse = SubscriptionCancelResponseDto.error(
                "User ID is required", subscriptionId, null);
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        try {
            SubscriptionCancelResponseDto response = membershipService.cancelSubscription(subscriptionId);
            
            if ("SUCCESS".equals(response.getStatus())) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
            
        } catch (Exception e) {
            log.error("구독 취소 중 오류 발생: subscriptionId={}", subscriptionId, e);
            return ResponseEntity.badRequest().body(SubscriptionCancelResponseDto.error(e.getMessage(), subscriptionId, null));
        }
    }
    
    /**
     * 구독 연장
     */
    @PostMapping("/{subscriptionId}/extend")
    public ResponseEntity<?> extendSubscription(
            @PathVariable Long subscriptionId,
            @RequestParam int months) {
        
        if (months <= 0) {
            return ResponseEntity.badRequest().body("연장 기간은 1개월 이상이어야 합니다.");
        }
        
        try {
            membershipService.extendSubscription(subscriptionId, months);
            return ResponseEntity.ok("구독이 " + months + "개월 연장되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("구독 연장 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    /**
     * 구독 생성
     */
    @PostMapping("/create")
    public ResponseEntity<SubscriptionCreateResponseDto> createSubscription(@RequestParam Long userId, @RequestBody SubscriptionCreateRequestDto request) {
        log.info("구독 생성 요청: userId={}, request={}", userId, request);
        
        try {
            request.setUserId(userId);
            SubscriptionCreateResponseDto response = membershipService.createSubscription(request);
            log.info("구독 생성 성공: {}", response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("구독 생성 중 오류 발생", e);
            return ResponseEntity.badRequest().body(SubscriptionCreateResponseDto.error(e.getMessage()));
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getMySubscriptionCount(@RequestHeader(value = "User-Id", required = false) Long userId) {
        if (userId == null) return ResponseEntity.badRequest().build();
        long count = membershipService.getMySubscriptions(userId).size();
        return ResponseEntity.ok(count);
    }
}
