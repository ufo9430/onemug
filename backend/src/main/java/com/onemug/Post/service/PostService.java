package com.onemug.Post.service;

import com.onemug.Post.dto.PostCreateRequestDto;
import com.onemug.Post.dto.PostDetailResponseDTO;
import com.onemug.Post.dto.PostUpdateRequestDto;
import com.onemug.Post.repository.CategoryRepository;
import com.onemug.Post.repository.PostRepository;
import com.onemug.global.entity.Category;
import com.onemug.global.entity.Creator;
import com.onemug.global.entity.Post;
import com.onemug.global.entity.User;
import com.onemug.like.repository.LikeRepository;
import com.onemug.newcreator.repository.CreatorRegisterRepository;
import com.onemug.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CreatorRegisterRepository creatorRegisterRepository;
    private final LikeRepository likeRepository;
    private final CategoryRepository categoryRepository;

    public Page<Post> getPostAllByPage(Long id, Pageable pageable) {
        return postRepository.findByCreatorId(id, pageable);
    }

    @Transactional
    public PostDetailResponseDTO getPost(Long id, Authentication authentication) {
        Post post = postRepository.findById(id).orElseThrow();
        User user = post.getCreator().getUser();
        boolean liked = likeRepository.existsByUserIdAndPostId(user.getId(), id);
        post.addViewCount();
        return PostDetailResponseDTO.from(post, user.getNickname(), liked);
    }

    public Post writePost(PostCreateRequestDto dto, Long creatorId) {
        Creator creator = creatorRegisterRepository.findById(creatorId).orElseThrow();
        Category category = categoryRepository.findById(dto.getCategoryId()).orElseThrow();

        Post post = Post.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .category(category)
                .creator(creator)
                .build();
        return postRepository.save(post);
    }

    public Post updatePost(Long id, PostUpdateRequestDto dto) {
        Post post = postRepository.findById(id).orElseThrow();
        Category category = categoryRepository.findById(dto.getCategoryId()).orElseThrow();

        post.update(dto.getTitle(), dto.getContent(), category);
        return postRepository.save(post);
    }
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}