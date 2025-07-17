package com.onemug.comment.controller;

import com.onemug.Post.service.PostService;
import com.onemug.comment.dto.CommentRequestDto;
import com.onemug.comment.service.CommentService;
import com.onemug.global.entity.Comment;
import com.onemug.global.entity.Post;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CommentController {
    private final CommentService commentService;
    private final PostService postService;

    public CommentController(CommentService commentService, PostService postService) {
        this.commentService = commentService;
        this.postService = postService;
    }

    @GetMapping("/post/{id}/comments")
    public List<Comment> getCommentAll(@PathVariable Long id) {
        return commentService.getAllComment(id);
    }


    @PostMapping("/post/{id}/comments")
    public Comment writeComment(@PathVariable Long id, @RequestBody CommentRequestDto dto /*, @AuthenticationPrincipal OAuth2User user*/) {
//        Long userId = ((Number) user.getAttribute("userId")).longValue();
//        User user = userRepository.findById(userId).orElseThrow();

        Post post = postService.getPost(id);

        Comment comment = Comment.builder()
                .content(dto.getContent())
                .post(post)
//                .user(user)
                .build();
        return commentService.writeComment(comment);
    }

    @PutMapping("/comment/update/{id}")
    public Comment updateComment(@PathVariable Long id, @RequestBody CommentRequestDto dto /*, @AuthenticationPrincipal OAuth2User user*/) {
        Comment comment = commentService.getComment(id);
        comment.update(dto.getContent());

        return commentService.updateComment(comment);
    }

    @DeleteMapping("/comment/delete/{id}")
    public void deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
    }
}
