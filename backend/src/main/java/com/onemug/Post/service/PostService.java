package com.onemug.Post.service;

import com.onemug.Post.repository.PostRepository;
import com.onemug.global.entity.Post;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;

    public Page<Post> getPostAllByPage(ObjectId id, Pageable pageable) {
        return postRepository.findAllByUserIdOrderByCreatedAtDesc(id, pageable);
    }

    public Post getPost(String id) {
        return postRepository.findById(new ObjectId(id)).orElse(null);
    }

    public Post writePost(Post post) {
        return postRepository.save(post);
    }

    public Post updatePost(Post post) { return postRepository.save(post); }
    public void deletePost(ObjectId id) {
        postRepository.deleteById(id);
    }
}