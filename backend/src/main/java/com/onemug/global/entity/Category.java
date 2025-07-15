package com.onemug.global.entity;

import jakarta.persistence.*;
import lombok.*;


@Getter
@Entity
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Integer viewCount;

    @OneToOne
    @JoinColumn(name = "post_id")
    private Post post;
}
