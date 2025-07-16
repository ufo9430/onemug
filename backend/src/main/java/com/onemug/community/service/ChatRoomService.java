package com.onemug.community.service;

import com.onemug.community.dto.ChatRoomResponseDTO;
import com.onemug.community.repository.ChatRoomRepository;
import com.onemug.global.entity.Chat;
import com.onemug.global.entity.Chatroom;
import com.onemug.global.entity.User;
import jakarta.persistence.EntityNotFoundException;
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
        List<ChatRoomResponseDTO> chatRoomResponseDTO = new ArrayList<>();

        List<Chatroom> chatrooms = chatRoomRepository.findAllByUserId(userId);
        for (Chatroom chatroom : chatrooms) {

            Long chatroomId = chatroom.getId();
            Chat recentChat = chatRoomRepository.findRecentChatByChatroomId(chatroomId)
                    .orElseThrow(EntityNotFoundException::new);
            User recentChatUser = recentChat.getUser();

            String recentChatContent = recentChat.getContent();
            String nickname = recentChatUser.getNickname();
            String profileUrl = recentChatUser.getProfileUrl();
            LocalDateTime createdAt = recentChat.getCreated_at();

            ChatRoomResponseDTO dto = ChatRoomResponseDTO.builder()
                    .recentChat(recentChatContent)
                    .chatroomId(chatroomId)
                    .nickname(nickname)
                    .profileUrl(profileUrl)
                    .createdAt(createdAt)
                    .build();

            chatRoomResponseDTO.add(dto);
        }
        return chatRoomResponseDTO;
    }

}