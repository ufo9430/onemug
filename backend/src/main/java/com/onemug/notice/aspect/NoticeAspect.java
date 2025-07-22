package com.onemug.notice.aspect;

import com.onemug.Post.repository.PostRepository;
import com.onemug.comment.dto.CommentResponseDTO;
import com.onemug.feed.repository.CreatorRepository;
import com.onemug.global.dto.MembershipResponseDto;
import com.onemug.global.entity.*;
import com.onemug.membership.dto.MembershipSelectionResponseDto;
import com.onemug.membership.dto.SubscriptionCancelResponseDto;
import com.onemug.membership.repository.MembershipRepository;
import com.onemug.membership.repository.MembershipSelectionRepository;
import com.onemug.notice.service.NoticeService;
import jakarta.persistence.EntityNotFoundException;
import org.aspectj.lang.JoinPoint;
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

    @Autowired
    private CreatorRepository creatorRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private MembershipSelectionRepository membershipSelectionRepository;

    // 사용자 id 조회 - 사용자 이름 정보, targetId 해결

    // 1. 구독 창작자의 글 작성 - 창작자 -> 구독자들
    @AfterReturning(pointcut = "execution(* com.onemug.Post.service.PostService.writePost(..))", returning = "result")
    public void afterPost(Object result){
        Post post = (Post) result;
        Long targetId = post.getId(); //창작자 게시글 ID
        String targetName = post.getTitle();
        Long senderId = post.getCreator().getUser().getId();

        List<User> subscribers = post.getCreator().getSubscriber();

        for (User receiver : subscribers) {
            Long receiverId = receiver.getId();
            noticeService.save(senderId, receiverId, targetId, targetName, NoticeType.POST);
        }

        //Long senderId, Long receiverId, Long targetId,
        //String targetName, NoticeType type
    }

    @AfterReturning(pointcut = "execution(* com.onemug.comment.service.CommentService.writeComment(..)", returning = "result")
    public void afterComment(Object result){
        CommentResponseDTO comment = (CommentResponseDTO) result;
        Long targetId = comment.getPost_id(); //댓글 달린 게시글
        String targetName = comment.getPost_title();
        Long senderId= comment.getUser_id(); //발신 - 댓글 작성자
        Long receiverId = comment.getCreator_id(); //수신 - 댓글 달린 게시글 작성자(창작자)
        noticeService.save(senderId, receiverId, targetId, targetName, NoticeType.COMMENT);

    }

    @AfterReturning(pointcut = "execution(* com.onemug.like.service.LikeService.likePost(..)")
    public void afterLike(JoinPoint joinPoint){
        Object[] args = joinPoint.getArgs();
        Long targetId = (Long) args[0];
        Long senderId = (Long) args[1];

        Post target = postRepository.findById(targetId).orElseThrow(EntityNotFoundException::new);

        Long receiverId = target.getCreator().getUser().getId();
        String targetName = target.getTitle();


        noticeService.save(senderId, receiverId, targetId, targetName, NoticeType.LIKE);
    }

    @AfterReturning(pointcut = "execution(* com.onemug.membership.service.MembershipSelectionService.confirmSelection(..)", returning = "result")
    public void afterSubscription(Object result){

        MembershipSelectionResponseDto responseDto =  (MembershipSelectionResponseDto) result;
        String selectionId = responseDto.getSelectionId();

        MembershipSelection membershipSelection = membershipSelectionRepository.findBySelectionId(selectionId).orElseThrow(EntityNotFoundException::new);


        Long receiverId = membershipSelection.getUser().getId();
        Long targetId = membershipSelection.getMembership().getCreator().getId();
        String targetName = responseDto.getMembershipName();

        Creator creator = creatorRepository.findById(targetId).orElseThrow(EntityNotFoundException::new);
        Long senderId = creator.getUser().getId();

        noticeService.save(senderId, receiverId, targetId, targetName, NoticeType.SUBSCRIBE);
    }

    // 유료 구독 해지 - 창작자 - 구독자 (해지 membership이 반환된다는 것을 전제로 작성)
    @AfterReturning(pointcut = "execution(* com.onemug.membership.service.MembershipService.cancelSubscription(..))", returning = "result")
    public void afterSubscriptionCancel(Object result){
        SubscriptionCancelResponseDto responseDto = (SubscriptionCancelResponseDto) result;
        Long targetId = responseDto.getCreatorId(); //해지되는 멤버십 ID 리액트에서 targetId로 프로필로 이동하니까
        String targetName = responseDto.getMembershipName(); //해지되는 멤버십 이름
        Long receiverId = responseDto.getUserId(); //수신 - 해지하는 구독자

        Creator creator = creatorRepository.findById(targetId).orElseThrow(EntityNotFoundException::new);
        Long senderId = creator.getUser().getId();

        noticeService.save(senderId, receiverId, targetId, targetName, NoticeType.UNSUBSCRIBE);
    }

}
