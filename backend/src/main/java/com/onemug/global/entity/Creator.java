package com.onemug.global.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.*;
import jakarta.persistence.Id;

import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class Creator {
    @Id
    private Long creator_id;

    private String introduceText;

    @OneToOne
    private User user;

    @OneToMany
    private List<User> subscriber = new ArrayList<>();
}
