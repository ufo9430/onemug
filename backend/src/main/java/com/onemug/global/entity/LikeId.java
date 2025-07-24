package com.onemug.global.entity;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class LikeId implements Serializable {
    private Long userId;
    private Long postId;

    public LikeId() {}

    public LikeId(Long userId, Long postId) {
        this.userId = userId;
        this.postId = postId;
    }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LikeId that = (LikeId) o;
        return Objects.equals(userId, that.userId) &&
                Objects.equals(postId, that.postId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, postId);
    }
}