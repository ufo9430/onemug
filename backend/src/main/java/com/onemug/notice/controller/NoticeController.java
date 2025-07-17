package com.onemug.notice.controller;

import com.onemug.notice.dto.NoticeInfoResponseDTO;
import com.onemug.notice.service.NoticeService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/notice")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    //전체 알림 조회
    public List<NoticeInfoResponseDTO> getAllNotice(HttpServletRequest request){
        //todo: 임시
        Long userId = 1L;

        return noticeService.findAllById(userId);
    }

}
