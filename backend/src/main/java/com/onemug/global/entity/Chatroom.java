package com.onemug.global.entity;

import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Document(collation = "chatroom")
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class Chatroom {
    @Id
    private ObjectId _id;

    private ObjectId participantId;
    private ObjectId chatId;
}
