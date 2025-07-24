package com.onemug.community.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NewChatroomResponseDTO {
    private Long chatroomId;
    private Long p1Id;
    private Long p2Id;
}

