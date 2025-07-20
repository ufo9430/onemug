package com.onemug.notice.controller;

import com.onemug.notice.dto.NoticeInfoResponseDTO;
import com.onemug.notice.service.NoticeService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notice")
@CrossOrigin(origins = "http://localhost:3000")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    //전체 알림 조회
    @GetMapping
    public List<NoticeInfoResponseDTO> getAllNotice(HttpServletRequest request){
        //todo: 임시
        Long userId = 1L;

        return noticeService.findAllById(userId);
    }

    // 모든 알림 읽음 처리
    @PostMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(HttpServletRequest request) {
        // todo: 임시
        Long userId = 1L;
        noticeService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }

    // 개별 알림 읽음 처리
    @PostMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        noticeService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

}
