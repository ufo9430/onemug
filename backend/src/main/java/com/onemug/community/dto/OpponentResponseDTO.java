package com.onemug.community.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OpponentResponseDTO {
    private Long id;
    private String nickname;
    private String profileUrl;
}
