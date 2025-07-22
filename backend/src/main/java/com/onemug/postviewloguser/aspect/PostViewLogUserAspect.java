package com.onemug.postviewloguser.aspect;

import com.onemug.Post.dto.PostDetailResponseDTO;
import com.onemug.global.entity.Post;
import com.onemug.global.entity.PostViewLog;
import com.onemug.global.entity.PostViewLogUser;
import com.onemug.insight.repository.PostViewLogRepository;
import com.onemug.postviewloguser.repository.PostViewLogUserRepository;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@Aspect
public class PostViewLogUserAspect {

    @Autowired
    private PostViewLogUserRepository logUserRepository;

    @AfterReturning(pointcut = "execution(* com.onemug.Post.service.PostService.getPost(..))", returning = "result")
    @Transactional
    public void afterPostView(JoinPoint joinPoint, Object result){
        PostDetailResponseDTO dto = (PostDetailResponseDTO) result;
        Authentication authentication = (Authentication) joinPoint.getArgs()[1];

        Long userId = Long.parseLong(authentication.getName());

        Long postId = dto.getId();

        PostViewLogUser log = PostViewLogUser.builder()
                .userId(userId)
                .postId(postId)
                .viewedAt(LocalDateTime.now())
                .build();

        logUserRepository.save(log);
    }
}
