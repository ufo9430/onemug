package com.onemug.global.entity;

import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collation = "membership")
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class Membership {
    @Id
    private ObjectId _id;

    private String name;
    private Integer price;
    private ObjectId creatorId;
    private ObjectId subscriberId;
    private String[] benefits;

    private LocalDateTime createdAt;
}
