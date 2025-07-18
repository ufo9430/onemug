package com.onemug.community.controller;

import com.onemug.community.dto.ChatResponseDTO;
import com.onemug.community.dto.RecentChatResponseDTO;
import com.onemug.community.dto.NewChatroomResponseDTO;
import com.onemug.community.service.ChatRoomService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/community")
public class CommunityController {
    @Autowired
    private ChatRoomService chatRoomService;

    @GetMapping
    public List<RecentChatResponseDTO> findChatRooms(HttpServletRequest request, HttpServletResponse response){
        //todo: 임시
        Long userId = 1L;

        return chatRoomService.browseChatrooms(userId);
    }


    //채팅방 입장(WebSocket으로 서버와 연결)
    @GetMapping("/{chatroomId}")
    public List<ChatResponseDTO> findChat(@PathVariable Long chatroomId, HttpServletRequest request, HttpServletResponse response){
    // 새 채팅을 시작했을 때 기능 X(기존 채팅의 내역을 조회하는 기능밖에 없어서 chatroom 테이블을 새로 생성하는 로직이 필요
        return chatRoomService.findChats(chatroomId);
    }

    // 새 채팅방을 만드는 get 요청, 채팅방 생성 이후 리디렉션은 프론트 파트에서 담당
    @GetMapping("/new/{targetId}")
    public NewChatroomResponseDTO enterChatroom(@PathVariable Long targetId, HttpServletRequest request, HttpServletResponse response){
        //todo: 임시
        Long senderId = 1L; // 채팅 버튼을 누르는 주체 requesterId senderId actorId
        //채팅방 조회 및 생성
        return chatRoomService.createChatroom(senderId,targetId);
    }


    // 현재 컨트롤러에서 생기는 예외를 받아서 ResponseEntity로 반환합니다
    // 서버 내부 오류 + 오류 내용을 http response로 반환하는 로직입니다
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("서버 내부 오류 " + e.getMessage());
    }
}
