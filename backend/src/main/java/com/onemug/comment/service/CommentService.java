package com.onemug.comment.service;

import com.onemug.Post.controller.PostController;
import com.onemug.comment.dto.CommentRequestDto;
import com.onemug.comment.dto.CommentResponseDTO;
import com.onemug.comment.repository.CommentRepository;
import com.onemug.global.entity.Comment;
import com.onemug.global.entity.Post;
import com.onemug.global.entity.User;
import com.onemug.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final PostController postService;

    public List<Comment> getAllComment(Long postId) {
        return commentRepository.findByPost_idOrderByCreatedAtDesc(postId);
    }
    public Comment getComment(Long commentId) {
        return commentRepository.findById(commentId).orElse(null);
    }
    public CommentResponseDTO writeComment(Long postId, Long userId, CommentRequestDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));
        Post post = postService.getPost(postId);

        Comment comment = Comment.builder()
                .content(dto.getContent())
                .post(post)
                .user(user)
                .build();

        Comment saved = commentRepository.save(comment);
        return CommentResponseDTO.from(saved);
    }
    public Comment updateComment(Comment comment) {
        return commentRepository.save(comment);
    }
    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }
}
