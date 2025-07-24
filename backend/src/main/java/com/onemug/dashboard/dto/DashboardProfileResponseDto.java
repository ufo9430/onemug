package com.onemug.dashboard.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardProfileResponseDto {

    // 크리에이터 정보
    private Long creatorId;
    private String introduceText;

    // 사용자 정보
    private Long userId;
    private String nickname;
    private String profileUrl;

    private Long subscriberCount;
    private Long postCount;
}
