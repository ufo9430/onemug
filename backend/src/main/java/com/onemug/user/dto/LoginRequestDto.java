package com.onemug.user.dto;

public record LoginRequestDto(
        String email,
        String password
) {}
