package com.onemug.community.controller;

import com.onemug.community.dto.ChatResponseDTO;
import com.onemug.community.dto.OpponentResponseDTO;
import com.onemug.community.dto.RecentChatResponseDTO;
import com.onemug.community.dto.NewChatroomResponseDTO;
import com.onemug.community.service.ChatRoomService;
import com.onemug.user.model.CustomUserDetails;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/community")
@CrossOrigin("http://localhost:3000")
public class CommunityController {
    @Autowired
    private ChatRoomService chatRoomService;

    @GetMapping
    public ResponseEntity<List<RecentChatResponseDTO>> findChatRooms(HttpServletRequest request, HttpServletResponse response,
                                                     Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long userId = Long.valueOf(authentication.getName());

        return ResponseEntity.ok(chatRoomService.browseChatrooms(userId));
    }


    //채팅방 입장(WebSocket으로 서버와 연결)
    @GetMapping("/{chatroomId}")
    public List<ChatResponseDTO> findChat(@PathVariable Long chatroomId, HttpServletRequest request, HttpServletResponse response) {
        // 새 채팅을 시작했을 때 기능 X(기존 채팅의 내역을 조회하는 기능밖에 없어서 chatroom 테이블을 새로 생성하는 로직이 필요
        return chatRoomService.findChats(chatroomId);
    }

    @GetMapping("/{chatroomId}/opponent")
    public ResponseEntity<OpponentResponseDTO> findOpponent(@PathVariable Long chatroomId, Authentication authentication){
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long userId = Long.valueOf(authentication.getName());
        if(authentication != null){
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            userId = userDetails.getUser().getId();
        }

        return ResponseEntity.ok(chatRoomService.getOpponent(chatroomId,userId));
    }

    // 새 채팅방을 만드는 get 요청, 채팅방 생성 이후 리디렉션은 프론트 파트에서 담당
    @GetMapping("/new/{targetId}")
    public ResponseEntity<NewChatroomResponseDTO> enterChatroom(@PathVariable Long targetId, HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long userId = Long.valueOf(authentication.getName());
        //채팅방 조회 및 생성
        return ResponseEntity.ok(chatRoomService.createChatroom(userId, targetId));
    }


    // 현재 컨트롤러에서 생기는 예외를 받아서 ResponseEntity로 반환합니다
    // 서버 내부 오류 + 오류 내용을 http response로 반환하는 로직입니다
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("서버 내부 오류 " + e.getMessage());
    }
}
