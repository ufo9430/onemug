package com.onemug.insight.aspect;

import com.onemug.global.entity.Post;
import com.onemug.global.entity.PostViewLog;
import com.onemug.insight.repository.PostViewLogRepository;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@Aspect
public class PostViewAspect {

    @Autowired
    private PostViewLogRepository postViewLogRepository;

    @AfterReturning(pointcut = "execution(* com.onemug.Post.service.PostService.getPost())", returning = "result")
    @Transactional
    public void afterPostView(Object result){
        Post targetPost = (Post) result;

        Long postId = targetPost.getId();
        Long creatorId = targetPost.getCreator().getId();

        PostViewLog log = PostViewLog.builder()
                .postId(postId)
                .creatorId(creatorId)
                .viewedAt(LocalDateTime.now())
                .build();

        postViewLogRepository.save(log);
        targetPost.addViewCount();
    }
}
