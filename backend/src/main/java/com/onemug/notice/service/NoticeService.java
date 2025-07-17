package com.onemug.notice.service;

import com.onemug.global.entity.Notice;
import com.onemug.global.entity.Post;
import com.onemug.global.entity.User;
import com.onemug.notice.dto.NoticeInfoDTO;
import com.onemug.notice.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoticeService {

    @Autowired
    private NoticeRepository noticeRepository;

    public void save(NoticeInfoDTO noticeInfo){
        //알림 정보 저장
    }

    public Notice generateNotice(String content, String targetName, String targetProfileUrl,
                                 Post targetPost, User receiver){
        return Notice.builder()
                .content(content)
                .targetName(targetName)
                .targetProfileUrl(targetProfileUrl)
                .targetPost(targetPost)
                .receiver(receiver)
                .build();
    }

    public void delete(long id){
        noticeRepository.deleteById(id);
    }

}
