package com.onemug.dashboard.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
@Builder
public class CreatorMembershipResponseDTO {
    private Long id;
    private String name;
    private Integer price;
    private List<String> benefits;
}
