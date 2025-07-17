package com.onemug.notice.aspect;

import com.onemug.global.dto.MembershipResponseDto;
import com.onemug.global.entity.*;
import com.onemug.notice.service.NoticeService;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Aspect
@Component
public class NoticeAspect {

    @Autowired
    private NoticeService noticeService;

    // 사용자 id 조회 - 사용자 이름 정보, targetId 해결

    // 1. 구독 창작자의 글 작성 - 창작자 -> 구독자들
    @AfterReturning(pointcut = "execution(* com.onemug.Post.service.PostService.writePost(..))", returning = "result")
    public void afterPost(Object result){
        Post post = (Post) result;
        Long postId = post.getId();
        Long senderId = post.getCreator().getUser().getId();

        List<User> subscribers = post.getCreator().getSubscriber();

        for (User receiver : subscribers) {
            Long receiverId = receiver.getId();
            noticeService.save(senderId, receiverId, postId, NoticeType.POST);
        }
    }

    // 내 글에 댓글 - 댓글작성자 - 본인(댓글달린글작성자)
    public void afterComment(Object result){
        Comment comment = (Comment) result;
        Long postId = comment.getPost().getId(); //댓글 달린 게시글
        Long senderId= comment.getUser().getId(); //발신 - 댓글 작성자
        Long receiverId = comment.getPost().getCreator().getUser().getId(); //수신 - 댓글 달린 게시글 작성자(창작자)

        noticeService.save(senderId, receiverId, postId, NoticeType.COMMENT);

    }

    // 내 글에 좋아요 - 작성자 - 본인
    public void afterLike(Object result){
        // Like Response DTO 나오면 구현
    }

    // 유료 구독 결제 - 창작자(알림받는) - 구독자
    public void afterSubscription(Object result){

    }

    // 유료 구독 해지 - 창작자 - 구독자 (해지 membership이 반환된다는 것을 전제로 작성)
    public void afterSubscriptionCancel(Object result){
//        MembershipResponseDto membership = (MembershipResponseDto) result;
//        Long membershipId = membership.getId(); //해지되는 멤버십
//        //senderId 발신은 무엇으로 할지
//        Long receiverId = membership.getCreatorId(); //Creator엔티티가 들어있어서 타입이 다르다 //수신 - 해지되는 멤버십 가진 창작자
//        //postId도 어떻게 처리를 할지
//        noticeService.save(senderId, receiverId, postId, NoticeType.UNSUBSCRIBE);
    }

}
