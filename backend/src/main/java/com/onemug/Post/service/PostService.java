package com.onemug.Post.service;

import com.onemug.Post.dto.PostCreateRequestDto;
import com.onemug.Post.dto.PostUpdateRequestDto;
import com.onemug.Post.repository.PostRepository;
import com.onemug.global.entity.Category;
import com.onemug.global.entity.Creator;
import com.onemug.global.entity.Post;
import com.onemug.newcreator.repository.CreatorRegisterRepository;
import com.onemug.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CreatorRegisterRepository creatorRegisterRepository;

    public Page<Post> getPostAllByPage(Long id, Pageable pageable) {
        return postRepository.findByCreatorId(id, pageable);
    }

    public Post getPost(Long id) {
        return postRepository.findById(id).orElse(null);
    }

    public Post writePost(PostCreateRequestDto dto, Long creatorId) {
        Creator creator = creatorRegisterRepository.findById(creatorId).orElseThrow();

        Post post = Post.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .category(new Category(dto.getCategoryId(), "커피", 0, null))
                .creator(creator)
                .build();
        return postRepository.save(post);
    }

    public Post updatePost(Long id, PostUpdateRequestDto dto) {
        Post post = getPost(id);
        post.update(dto.getTitle(), dto.getContent());
        return postRepository.save(post);
    }
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}