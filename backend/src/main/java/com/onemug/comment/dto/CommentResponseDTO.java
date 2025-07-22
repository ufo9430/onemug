package com.onemug.comment.dto;

import com.onemug.global.entity.Comment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CommentResponseDTO {
    private Long id;
    private Long creator_id;
    private Long post_id;
    private String post_title;
    private String content;
    private String username;
    private Long user_id;
    private LocalDateTime createdAt;

    public static CommentResponseDTO from(Comment comment) {
        return new CommentResponseDTO(
                comment.getId(),
                comment.getPost().getCreator().getUser().getId(),
                comment.getPost().getId(),
                comment.getPost().getTitle(),
                comment.getContent(),
                comment.getUser().getNickname(),
                comment.getUser().getId(),
                comment.getCreatedAt()
        );
    }
}
