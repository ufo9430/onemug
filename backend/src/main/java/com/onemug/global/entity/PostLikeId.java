package com.onemug.global.entity;

import lombok.*;
import java.io.Serializable;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode
public class PostLikeId implements Serializable {
    private Long user;
    private Long post;
}
