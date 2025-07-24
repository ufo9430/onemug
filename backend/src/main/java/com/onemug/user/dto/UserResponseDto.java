package com.onemug.user.dto;

import com.onemug.global.entity.User;

public record UserResponseDto(Long id, String email, String nickname, String profileUrl) {
    public static UserResponseDto from(User user) {
        return new UserResponseDto(user.getId(), user.getEmail(), user.getNickname(), user.getProfileUrl());
    }
}