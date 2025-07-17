package com.onemug.notice.service;

import com.onemug.Post.repository.PostRepository;
import com.onemug.global.entity.Notice;
import com.onemug.global.entity.NoticeType;
import com.onemug.global.entity.Post;
import com.onemug.global.entity.User;
import com.onemug.notice.dto.NoticeInfoResponseDTO;
import com.onemug.notice.repository.NoticeRepository;
import com.onemug.notice.repository.NoticeUserTempRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class NoticeService {

    @Autowired
    private NoticeRepository noticeRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private NoticeUserTempRepository userRepository;

    public void save(Long senderId, Long receiverId, Long postId, NoticeType type){
        User sender = userRepository.findById(senderId).orElseThrow(EntityNotFoundException::new);
        User receiver = userRepository.findById(receiverId).orElseThrow(EntityNotFoundException::new);
        Post post = postRepository.findById(postId).orElseThrow(EntityNotFoundException::new);
        String content = type.getMessage();
        noticeRepository.save(generateNotice(sender,receiver,post,content,type));
    }

    private Notice generateNotice(User sender, User receiver, Post post, String content, NoticeType noticeType){
        return Notice.builder()
                .receiver(receiver)
                .sender(sender)
                .type(noticeType)
                .content(content)
                .build();
    }

    public void delete(long id){
        noticeRepository.deleteById(id);
    }

    public List<NoticeInfoResponseDTO> findAllById(Long userId){
        List<NoticeInfoResponseDTO> noticeInfoDTOS = new ArrayList<>();

        //todo: noticeInfoDTOS에 공지 데이터를 채워서 반환
        List<Notice> notices = noticeRepository.findAllByReceiverId(userId);
        for (Notice notice : notices) {
            User user = notice.getSender();
            Post post = notice.getPost();

            String targetUserNickname = user.getNickname();
            String targetProfileUrl = user.getProfileUrl();
            String content = notice.getContent();
            String targetPostName = post.getTitle();

            NoticeInfoResponseDTO dto = new NoticeInfoResponseDTO(
                    targetUserNickname,
                    targetProfileUrl,
                    content,
                    targetPostName
            );

            noticeInfoDTOS.add(dto);
        }
        return noticeInfoDTOS;
    }

}
