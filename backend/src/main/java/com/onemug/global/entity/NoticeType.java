package com.onemug.global.entity;

public enum NoticeType {
    POST("새로운 게시글을 올렸습니다"),
    COMMENT("회원님의 게시글에 댓글을 달았습니다"),
    LIKE("게시글에 좋아요를 눌렸습니다");

    private final String message;

    NoticeType(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
