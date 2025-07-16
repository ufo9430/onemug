package com.onemug.community.service;

import com.onemug.community.dto.ChatRoomResponseDTO;
import com.onemug.community.repository.ChatRoomRepository;
import com.onemug.global.entity.Chat;
import com.onemug.global.entity.Chatroom;
import com.onemug.global.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ChatRoomService {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    public List<ChatRoomResponseDTO> findAll(Long userId) {
        //Ctrl + Alt + V: 변수 추출 (Extract Variable)
        //Alt + Enter: 빠른 오류 해결
        //todo: 결과값은 ChatRoomResponseDTO이기 때문에, 빈 List<ChatRoomResponseDTO> 객체가 하나 필요해 보여요
        List<ChatRoomResponseDTO> chatRoomResponseDTO = new ArrayList<>();

        List<Chatroom> chatrooms = chatRoomRepository.findAllByUserId(userId);
        for (Chatroom chatroom : chatrooms) {
            // todo: DTO에 필요한 값을 찾아 주입

            Long chatroomId = chatroom.getId();
            chatRoomRepository.findRecentChatByChatroomId(chatroomId);

            String recentChat = chat
            String nickname
            String profileUrl
            LocalDateTime createdAt = chat

            chatrooms.add();
        }

        return chatRoomResponseDTO;
    }

}
