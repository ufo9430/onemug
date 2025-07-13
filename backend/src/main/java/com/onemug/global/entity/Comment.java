package com.onemug.global.entity;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "comment")
public class Comment {
    @Id
    private ObjectId _id;

    private ObjectId postId;
    private ObjectId userId;
    private String content;

    private LocalDateTime createdAt;
}
