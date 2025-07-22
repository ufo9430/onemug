package com.onemug.dashboard.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;


@Getter
@Builder
public class CreatorMembershipRequestDTO {
    private String name;
    private Integer price;
    private List<String> benefits;
}
