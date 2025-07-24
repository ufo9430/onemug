package com.onemug.user.dto;

public record UserRequestDto(
        String email,
        String password,
        String nickname,
        String profileUrl
) {}
