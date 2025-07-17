package com.onemug.community.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ChatResponseDTO {
    private String nickname; //작성자 닉네임
    private String profileUrl; //작성자 프로필사진 url
    private String content; //채팅내용
    private LocalDateTime createdAt; //채팅작성시간
}
