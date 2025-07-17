package com.onemug.community.controller;

import com.onemug.community.dto.ChatResponseDTO;
import com.onemug.community.dto.ChatRoomResponseDTO;
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
    public List<ChatRoomResponseDTO> findChatRooms(HttpServletRequest request, HttpServletResponse response){
        //todo: 임시
        Long userId = 1L;

        return chatRoomService.findChatRooms(userId);
    }


    //채팅방 입장(WebSocket으로 서버와 연결)
    @GetMapping("/{chatroomId}")
    public List<ChatResponseDTO> enterChatroom(@PathVariable Long chatroomId, HttpServletRequest request, HttpServletResponse response){

        return chatRoomService.findChats(chatroomId);
    }


    // 현재 컨트롤러에서 생기는 예외를 받아서 ResponseEntity로 반환합니다
    // 서버 내부 오류 + 오류 내용을 http response로 반환하는 로직입니다
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("서버 내부 오류 " + e.getMessage());
    }
}
