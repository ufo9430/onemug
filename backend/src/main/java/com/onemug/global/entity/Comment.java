package com.onemug.global.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Document(collection = "comment")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Comment {
    @Id
    private ObjectId _id;

    private ObjectId postId;
    private ObjectId userId;
    private String content;

    private LocalDateTime createdAt;
}
