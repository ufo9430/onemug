package com.onemug.Post.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import org.bson.types.ObjectId;

@Getter
public class PostCreateRequestDto {
    @NotBlank
    private String title;

    @NotBlank
    private String content;

    @NotNull
    private ObjectId categoryId;

    @NotNull
    private ObjectId userId;
}
