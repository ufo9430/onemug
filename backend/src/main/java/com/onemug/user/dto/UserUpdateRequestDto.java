package com.onemug.user.dto;

public record UserUpdateRequestDto(
        String nickname,
        String profileUrl,
        String password,
        String currentPassword
) {}
