package com.onemug.Post.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class PostCreateRequestDto {
    @NotBlank
    private String title;

    @NotBlank
    private String content;

    @NotNull
    private Long categoryId;

    @NotNull
    private Long userId;
}
