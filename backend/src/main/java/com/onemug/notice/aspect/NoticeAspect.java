package com.onemug.notice.aspect;

import com.onemug.global.entity.Notice;
import com.onemug.global.entity.Post;
import com.onemug.global.entity.User;
import com.onemug.notice.dto.NoticeInfoDTO;
import com.onemug.notice.service.NoticeService;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class NoticeAspect {

    @Autowired
    private NoticeService noticeService;

    @Pointcut("@annotation(com.onemug.notice.annotation.NotifyBehavior)")
    public void noticePointcut(){

    }


    @AfterReturning(pointcut = "noticePointcut()", returning = "result")
    public void getValue(JoinPoint joinPoint, Object result){

        // 구독 창작자의 글 작성, 내 글에 댓글, 내 글에 좋아요, 내 댓글에 답글
        // 사용자 id 조회 - 사용자 이름 정보, targetId 해결
        Object[] args = joinPoint.getArgs();
        

        noticeService.save(noticeType, targetUser, targetPost, receivers);
    }

    public void createPost(HttpServletRequest request){

    }


}
