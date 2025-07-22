package com.onemug.newcreator.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class CreatorUpdateDto {
    private Long creatorId;
    private String introduceText;

    private Long userId;
    private String nickname;
    private String profileUrl;
}
