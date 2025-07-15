package com.onemug.global.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class Membership {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Integer price;

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private Creator creator;

    private LocalDateTime createdAt;

    @OneToMany
    private List<Benefit> benefitList = new ArrayList<>();

}
