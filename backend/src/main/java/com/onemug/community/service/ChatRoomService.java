package com.onemug.community.service;

import com.onemug.community.dto.ChatPayloadDTO;
import com.onemug.community.dto.ChatResponseDTO;
import com.onemug.community.dto.ChatRoomResponseDTO;
import com.onemug.community.repository.ChatRepository;
import com.onemug.community.repository.ChatRoomRepository;
import com.onemug.community.repository.ChatRoomUserTempRepository;
import com.onemug.global.entity.Chat;
import com.onemug.global.entity.Chatroom;
import com.onemug.global.entity.User;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ChatRoomService {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private ChatRoomUserTempRepository userRepository;

    public List<ChatRoomResponseDTO> findChatRooms(Long userId) {
        List<ChatRoomResponseDTO> chatRoomResponseDTO = new ArrayList<>();

        List<Chatroom> chatrooms = chatRoomRepository.findAllByUserId(userId);
        for (Chatroom chatroom : chatrooms) {

            Long chatroomId = chatroom.getId();
            Chat recentChat = chatRepository.findTop1ByChatRoomIdOrderByCreatedAtDesc(chatroomId).orElseThrow(EntityNotFoundException::new);
            User recentChatUser = recentChat.getUser();

            String recentChatContent = recentChat.getContent();
            String nickname = recentChatUser.getNickname();
            String profileUrl = recentChatUser.getProfileUrl();
            LocalDateTime createdAt = recentChat.getCreatedAt();

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

    public List<ChatResponseDTO> findChats(Long chatroomId) {
        List<ChatResponseDTO> chatDTOList = new ArrayList<>();
        Chatroom chatroom = chatRoomRepository.findById(chatroomId).orElseThrow(EntityNotFoundException::new);
        List<Chat> chatList = chatroom.getChat();

        for (Chat chat : chatList) {
            //2. 채팅방에서 전체 채팅 조회하고, ChatResponseDTO에 주입
            //1. 작성자 닉네임 2. 작성자 프로필사진 url 3. 채팅내용 4. 채팅작성시간
            //그리고 클래스 필드 이런거 궁금하시면 컨트롤 누르고 클래스이름 클릭하면 바로 확인가능해요

            User user = chat.getUser();

            String nickname = user.getNickname();
            String profileUrl = user.getProfileUrl();
            String content = chat.getContent();
            LocalDateTime createdAt = chat.getCreatedAt();

            ChatResponseDTO dto = ChatResponseDTO.builder()
                    .nickname(nickname)
                    .profileUrl(profileUrl)
                    .content(content)
                    .createdAt(createdAt)
                    .build();

            chatDTOList.add(dto);
        }

        return chatDTOList;
    }

    public void saveChat(ChatPayloadDTO payloadDTO){

        Long userId = payloadDTO.getUserId();
        Long chatroomId = payloadDTO.getChatroomId();
        String content = payloadDTO.getContent();

        User user = userRepository.findById(userId).orElseThrow(EntityNotFoundException::new);
        Chatroom chatroom = chatRoomRepository.findById(chatroomId).orElseThrow(EntityNotFoundException::new);

        Chat chat = Chat.builder()
                .user(user)
                .chatRoom(chatroom)
                .content(content)
                .createdAt(LocalDateTime.now())
                .build();

        chatRepository.save(chat);
    }

}