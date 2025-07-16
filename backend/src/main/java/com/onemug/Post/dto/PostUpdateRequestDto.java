package com.onemug.Post.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class PostUpdateRequestDto {
    @NotBlank
    private String title;

    @NotBlank
    private String content;
}
