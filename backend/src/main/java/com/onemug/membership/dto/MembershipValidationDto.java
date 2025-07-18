package com.onemug.membership.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MembershipValidationDto {
    private boolean isValid;
    private String errorCode;
    private String errorMessage;
    private boolean isDuplicate; // 중복 구독 여부
    private boolean isUserActive; // 사용자 계정 활성 상태
    private String currentMembershipStatus; // 현재 구독 상태
    
    public static MembershipValidationDto success() {
        return MembershipValidationDto.builder()
                .isValid(true)
                .isDuplicate(false)
                .isUserActive(true)
                .build();
    }
    
    public static MembershipValidationDto error(String errorCode, String errorMessage) {
        return MembershipValidationDto.builder()
                .isValid(false)
                .errorCode(errorCode)
                .errorMessage(errorMessage)
                .build();
    }
}
