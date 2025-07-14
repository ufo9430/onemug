package com.onemug.Post.service;

import com.onemug.Post.repository.PostRepository;
import com.onemug.global.entity.Post;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;

    public Page<Post> getPostAllByPage(Pageable pageable, Long id) {
        return postRepository.findAllByUserIdOrderByCreatedAtDesc(pageable, id);
    }

    public Post getPost(Long id) {
        return postRepository.findById(id).orElse(null);
    }

    public void writePost(Post post) {
        postRepository.save(post);
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}