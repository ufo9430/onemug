package com.onemug.comment.service;

import com.onemug.comment.repository.CommentRepository;
import com.onemug.global.entity.Comment;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {
    private final CommentRepository commentRepository;

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public List<Comment> getAllComment(Long postId) {
        return commentRepository.findByPost_idOrderByCreatedAtDesc(postId);
    }
    public Comment getComment(Long commentId) {
        return commentRepository.findById(commentId).orElse(null);
    }
    public Comment writeComment(Comment comment) {
        return commentRepository.save(comment);
    }
    public Comment updateComment(Comment comment) {
        return commentRepository.save(comment);
    }
    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }
}
