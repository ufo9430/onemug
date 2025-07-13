package com.onemug.global.entity;

import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Document(collation = "user")
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class User {
    @Id
    private ObjectId _id;

    private String nickname;
    private String email;
    private String password;
    private String profileUrl;

    private ObjectId subscribed;
    private ObjectId creatorId;

}
