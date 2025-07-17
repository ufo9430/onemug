package com.onemug.global.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder(toBuilder = true)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nickname;
    private String email;
    private String password;

    @Builder.Default
    @Column(name = "profile_url")
    private String profileUrl = "/images/default-profile.jpg";

    @OneToMany
    private List<Membership> subscribed = new ArrayList<>();

}
