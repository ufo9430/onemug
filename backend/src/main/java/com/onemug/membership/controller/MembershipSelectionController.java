package com.onemug.membership.controller;

import com.onemug.membership.dto.MembershipSelectionRequestDto;
import com.onemug.membership.dto.MembershipSelectionResponseDto;
import com.onemug.membership.service.MembershipSelectionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/memberships")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class MembershipSelectionController {
    
    private final MembershipSelectionService membershipSelectionService;
    
    /**
     * 멤버십 선택 처리
     */
    @PostMapping("/select")
    public ResponseEntity<MembershipSelectionResponseDto> selectMembership(
            @RequestBody MembershipSelectionRequestDto request,
            @RequestHeader("User-Id") Long userId) {
        
        try {
            request.setUserId(userId);
            MembershipSelectionResponseDto response = membershipSelectionService.selectMembership(request);
            
            if ("ERROR".equals(response.getStatus())) {
                return ResponseEntity.badRequest().body(response);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("멤버십 선택 처리 중 오류 발생", e);
            return ResponseEntity.internalServerError()
                    .body(MembershipSelectionResponseDto.builder()
                            .status("ERROR")
                            .message("서버 오류가 발생했습니다: " + e.getMessage())
                            .build());
        }
    }
    
    /**
     * 선택 정보 조회
     */
    @GetMapping("/{selectionId}")
    public ResponseEntity<MembershipSelectionResponseDto> getSelection(
            @PathVariable String selectionId,
            @RequestHeader("User-Id") Long userId) {
        
        try {
            return membershipSelectionService.getSelectionById(selectionId)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.ok(
                        MembershipSelectionResponseDto.builder()
                            .status("NOT_FOUND")
                            .message("선택 정보를 찾을 수 없습니다. 다시 시도해 주세요.")
                            .nextStep("SELECT")
                            .build()
                    ));
                    
        } catch (Exception e) {
            log.error("선택 정보 조회 중 오류 발생", e);
            return ResponseEntity.internalServerError()
                    .body(MembershipSelectionResponseDto.builder()
                            .status("ERROR")
                            .message("서버 오류가 발생했습니다: " + e.getMessage())
                            .nextStep("SELECT")
                            .build());
        }
    }
    
    /**
     * 선택 확인 처리
     */
    @PostMapping("/{selectionId}/confirm")
    public ResponseEntity<MembershipSelectionResponseDto> confirmSelection(
            @PathVariable String selectionId,
            @RequestHeader("User-Id") Long userId) {
        
        try {
            MembershipSelectionResponseDto response = membershipSelectionService.confirmSelection(selectionId);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("선택 확인 처리 중 오류 발생", e);
            return ResponseEntity.badRequest()
                    .body(MembershipSelectionResponseDto.builder()
                            .status("ERROR")
                            .message(e.getMessage())
                            .build());
        }
    }
    
    /**
     * 멤버십 선택 유효성 검증
     */
    @PostMapping("/validate")
    public ResponseEntity<?> validateMembershipSelection(
            @RequestBody MembershipSelectionRequestDto request,
            @RequestHeader("User-Id") Long userId) {
        
        try {
            request.setUserId(userId);
            // 유효성 검증만 수행하고 실제 선택은 하지 않음
            // 이 기능은 프론트엔드에서 사용자가 선택하기 전에 미리 확인할 때 사용
            
            return ResponseEntity.ok().body("유효성 검증 기능은 selectMembership에서 처리됩니다.");
            
        } catch (Exception e) {
            log.error("멤버십 선택 유효성 검증 중 오류 발생", e);
            return ResponseEntity.internalServerError()
                    .body("서버 오류가 발생했습니다: " + e.getMessage());
        }
    }
}
