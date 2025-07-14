package com.onemug.global.entity;

import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Document(collection = "post")
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class Post {
    @Id
    private ObjectId _id;

    private String title;
    private String content;

    private ObjectId categoryId;
    private ObjectId userId;
    private Integer viewCount;
    private Integer likeCount;

    private LocalDateTime createdAt;
//    private LocalDateTime updatedAt;
public void update(String title, String content) {
    this.title = title;
    this.content = content;
}
}
