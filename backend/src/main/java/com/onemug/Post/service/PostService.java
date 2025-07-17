package com.onemug.Post.service;

import com.onemug.Post.dto.PostCreateRequestDto;
import com.onemug.Post.repository.PostRepository;
import com.onemug.global.entity.Category;
import com.onemug.global.entity.Creator;
import com.onemug.global.entity.Post;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;

    public Page<Post> getPostAllByPage(Long id, Pageable pageable) {
        return postRepository.findByCreatorId(id, pageable);
    }

    public Post getPost(Long id) {
        return postRepository.findById(id).orElse(null);
    }

    public Post writePost(PostCreateRequestDto dto) {
        Post post = Post.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .category(new Category(dto.getCategoryId(), "커피", 0, null))
                .creator(new Creator(dto.getCreatorId(), "text", null, null))
                .build();
        return postRepository.save(post);
    }

    public Post updatePost(Post post) { return postRepository.save(post); }
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}