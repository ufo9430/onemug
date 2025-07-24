package com.onemug.managesubscriber.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class SubscribersResponseDTO {
    private Long id;
    private String name;
    private String email;
    private LocalDateTime joinDate;
    private String membershipType;
    private String avatarUrl;
}
