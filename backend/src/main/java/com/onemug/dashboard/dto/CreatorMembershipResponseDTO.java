package com.onemug.dashboard.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Getter
@Builder
public class CreatorMembershipResponseDTO {
    private Long membershipId;
    private Integer price;
    private String name;

    private Map<Long, String> benefits;
}
