package com.onemug.notice.service;

import com.onemug.Post.repository.PostRepository;
import com.onemug.global.entity.Notice;
import com.onemug.global.entity.NoticeType;
import com.onemug.global.entity.User;
import com.onemug.notice.dto.NoticeInfoResponseDTO;
import com.onemug.notice.repository.NoticeRepository;
import com.onemug.notice.repository.NoticeUserTempRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NoticeService {

    @Autowired
    private NoticeRepository noticeRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private NoticeUserTempRepository userRepository;

    public void save(Long senderId, Long receiverId, Long targetId,
                     String targetName, NoticeType type){
        User sender = userRepository.findById(senderId).orElseThrow(EntityNotFoundException::new);
        User receiver = userRepository.findById(receiverId).orElseThrow(EntityNotFoundException::new);
        String content = type.getMessage();
        noticeRepository.save(generateNotice(sender,receiver,content,targetId,targetName,type));
    }

    private Notice generateNotice(User sender, User receiver, String content, Long targetId, String targetName, NoticeType noticeType){
        return Notice.builder()
                .receiver(receiver)
                .sender(sender)
                .type(noticeType)
                .content(content)
                .targetId(targetId)
                .targetName(targetName)
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

            Long noticeId = notice.getId();
            String targetUserNickname = user.getNickname();
            String targetProfileUrl = user.getProfileUrl();
            String content = notice.getContent();
            Long targetId = notice.getTargetId();
            String targetName = notice.getTargetName();
            LocalDateTime createdAt = notice.getCreatedAt();
            NoticeType type = notice.getType();
            boolean isRead = notice.isRead();

            NoticeInfoResponseDTO dto = new NoticeInfoResponseDTO(
                    noticeId,
                    targetUserNickname,
                    targetProfileUrl,
                    content,
                    targetId,
                    targetName,
                    createdAt,
                    isRead,
                    type.name()
            );

            noticeInfoDTOS.add(dto);
        }
        return noticeInfoDTOS;
    }

    public Map<String, Object> checkUnread(Long userId){
        Map<String, Object> map = new HashMap<>();

        boolean isUnreadExists = noticeRepository.existsByReceiverIdAndIsReadFalse(userId);
        map.put("checkUnread", isUnreadExists);

        return map;
    }

    //모든 알림 읽음 처리
    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notice> notices = noticeRepository.findAllByReceiverId(userId);
        for (Notice notice : notices) {
            notice.markAsRead();
        }
    }

    // 개별 알림 읽음 처리
    @Transactional
    public void markAsRead(Long noticeId) {
        Notice notice = noticeRepository.findById(noticeId).orElseThrow(EntityNotFoundException::new);
        notice.markAsRead(); // is_read = true
    }

}
