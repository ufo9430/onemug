package com.onemug.membership.controller;

import com.onemug.global.dto.MembershipResponseDto;
import com.onemug.membership.service.MembershipService;
import com.onemug.membership.dto.SubscriptionHistoryDto;
import com.onemug.membership.dto.SubscriptionCancelResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/memberships", produces = "application/json; charset=UTF-8")
@CrossOrigin(origins = "*")
public class MembershipController {
    
    @Autowired
    private MembershipService membershipService;
    
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
     * 멤버십 상세 조회
     * GET /memberships/{membershipId}
     */
    @GetMapping("/{membershipId}")
    public ResponseEntity<MembershipResponseDto> getMembershipById(@PathVariable Long membershipId) {
        
        Optional<MembershipResponseDto> membership = membershipService.getMembershipById(membershipId);
        
        if (membership.isPresent()) {
            return ResponseEntity.ok(membership.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * 크리에이터별 멤버십 조회
     * GET /memberships/creator/{creatorId}
     */
    @GetMapping("/creator/{creatorId}")
    public ResponseEntity<List<MembershipResponseDto>> getMembershipsByCreator(@PathVariable Long creatorId) {
        
        List<MembershipResponseDto> memberships = membershipService.getMembershipsByCreator(creatorId);
        return ResponseEntity.ok(memberships);
    }
    
    /**
     * 멤버십 검색
     * GET /memberships/search?keyword=
     */
    @GetMapping("/search")
    public ResponseEntity<List<MembershipResponseDto>> searchMemberships(@RequestParam String keyword) {
        
        List<MembershipResponseDto> memberships = membershipService.searchMemberships(keyword);
        return ResponseEntity.ok(memberships);
    }
    
    /**
     * 모든 멤버십 조회
     * GET /memberships
     */
    @GetMapping(value = "", produces = "application/json; charset=UTF-8")
    public ResponseEntity<List<MembershipResponseDto>> getAllMemberships() {
        
        List<MembershipResponseDto> memberships = membershipService.getAllMemberships();
        return ResponseEntity.ok(memberships);
    }
    
    /**
     * 구독 취소
     * DELETE /memberships/{membershipId}/cancel
     */
    @DeleteMapping(value = "/{membershipId}/cancel", produces = "application/json; charset=UTF-8")
    public ResponseEntity<SubscriptionCancelResponseDto> cancelSubscription(
            @PathVariable Long membershipId,
            @RequestHeader(value = "User-Id", required = false) Long userId) {
        
        if (userId == null) {
            SubscriptionCancelResponseDto errorResponse = SubscriptionCancelResponseDto.error(
                "User ID is required", membershipId, null);
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        try {
            SubscriptionCancelResponseDto response = membershipService.cancelSubscription(membershipId, userId);
            
            if ("SUCCESS".equals(response.getStatus())) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
            
        } catch (Exception e) {
            SubscriptionCancelResponseDto errorResponse = SubscriptionCancelResponseDto.error(
                "구독 취소 중 예상치 못한 오류가 발생했습니다: " + e.getMessage(), membershipId, userId);
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}
