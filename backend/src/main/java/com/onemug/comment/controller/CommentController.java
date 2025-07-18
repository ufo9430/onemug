package com.onemug.comment.controller;

import com.onemug.Post.service.PostService;
import com.onemug.comment.dto.CommentRequestDto;
import com.onemug.comment.dto.CommentResponseDTO;
import com.onemug.comment.service.CommentService;
import com.onemug.global.entity.Comment;
import com.onemug.global.utils.AuthUtils;
import com.onemug.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;
    private final PostService postService;
    private final UserRepository userRepository;

    @GetMapping("/post/{id}/comments")
    public List<Comment> getCommentAll(@PathVariable Long id) {
        return commentService.getAllComment(id);
    }


    @PostMapping("/post/{id}/comments")
    public ResponseEntity<CommentResponseDTO> writeComment(@PathVariable Long id, @RequestBody CommentRequestDto dto, @AuthenticationPrincipal Object principal) {
        Long userId = AuthUtils.extractUserId(principal, userRepository);

        CommentResponseDTO responseDto = commentService.writeComment(id, userId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @PutMapping("/comment/update/{id}")
    public ResponseEntity<CommentResponseDTO> updateComment(@PathVariable Long id, @RequestBody CommentRequestDto dto) {
        Comment comment = commentService.getComment(id);
        comment.update(dto.getContent());

        Comment updated = commentService.updateComment(comment);
        CommentResponseDTO responseDto = CommentResponseDTO.from(updated);

        return ResponseEntity.ok(responseDto);
    }

    @DeleteMapping("/comment/delete/{id}")
    public void deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
    }
}
