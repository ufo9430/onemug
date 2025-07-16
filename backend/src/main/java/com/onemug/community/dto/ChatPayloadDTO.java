package com.onemug.community.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class ChatPayloadDTO {
    private Long userId;
    private Long chatroomId;
    private String content;
}
