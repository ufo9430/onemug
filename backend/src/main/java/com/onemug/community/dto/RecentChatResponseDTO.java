package com.onemug.community.dto;


// 해당 사용자의 프로필(사진 + 이름), 채팅 내용, 작성 날짜가 들어가야 합니다

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class RecentChatResponseDTO {
    private Long chatroomId; // 채팅방 id
    private String recentChat; // 가장 최근 채팅 내용
    private String nickname; // 최근 채팅 작성자 닉네임
    private String profileUrl; // 최근 채팅 작성자 프로필
    private LocalDateTime createdAt; // 최근 채팅 생성날짜
}
