package com.onemug.community.controller;

import com.onemug.community.dto.ChatRoomResponseDTO;
import com.onemug.community.service.ChatRoomService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

        return chatRoomService.findAll(userId);
    }


    //채팅방 입장(WebSocket으로 서버와 연결)

}
