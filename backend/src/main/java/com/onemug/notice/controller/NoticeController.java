    package com.onemug.notice.controller;
    import com.onemug.notice.dto.NoticeInfoResponseDTO;
    import com.onemug.notice.service.NoticeService;
    import com.onemug.user.model.CustomUserDetails;
    import jakarta.servlet.http.HttpServletRequest;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.core.Authentication;
    import org.springframework.security.oauth2.jwt.Jwt;
    import org.springframework.web.bind.annotation.*;
    import java.util.List;
    import java.util.Map;

    @RestController
    @RequestMapping("/notice")
    @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
    public class NoticeController {

        @Autowired
        private NoticeService noticeService;

        //전체 알림 조회
        @GetMapping
        public ResponseEntity<List<NoticeInfoResponseDTO>> getAllNotice(HttpServletRequest request, Authentication authentication){
            if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Long userId = Long.valueOf(authentication.getName());

            return ResponseEntity.ok(noticeService.findAllById(userId));
        }

        // 모든 알림 읽음 처리
        @PostMapping("/read-all")
        public ResponseEntity<Void> markAllAsRead(HttpServletRequest request, Authentication authentication) {
            if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Long userId = Long.valueOf(authentication.getName());
            noticeService.markAllAsRead(userId);
            return ResponseEntity.ok().build();
        }

        // 개별 알림 읽음 처리
        @PostMapping("/{id}/read")
        public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
            noticeService.markAsRead(id);
            return ResponseEntity.ok().build();
        }

        @GetMapping("/api/unread")
        public ResponseEntity<Map<String, Object>> checkUnread(Authentication authentication){
            if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Long userId = Long.valueOf(authentication.getName());

            return ResponseEntity.ok(noticeService.checkUnread(userId));
        }

    }
