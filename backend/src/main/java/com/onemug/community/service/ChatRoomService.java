package com.onemug.community.service;

import com.onemug.community.dto.*;
import com.onemug.community.repository.ChatRepository;
import com.onemug.community.repository.ChatRoomRepository;
import com.onemug.community.repository.ChatRoomUserTempRepository;
import com.onemug.global.entity.Chat;
import com.onemug.global.entity.Chatroom;
import com.onemug.global.entity.User;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
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

    //ChatRoomResponseDTO - RecentChatResponseDTO ChatroomThumbnailResponseDTO
    public List<RecentChatResponseDTO> browseChatrooms(Long userId) {
        List<RecentChatResponseDTO> recentChatResponseDTO = new ArrayList<>();
        User currentUser = userRepository.findById(userId).orElseThrow(EntityNotFoundException::new);

        List<Chatroom> chatrooms = chatRoomRepository.findAllByUserId(userId);
        for (Chatroom chatroom : chatrooms) {
            Long chatroomId = chatroom.getId();
            List<User> participant = chatroom.getParticipant();
            User opponent = participant.get(0).equals(currentUser)
                    ? participant.get(1) : participant.get(0);
            try {
                Chat recentChat = chatRepository.findTop1ByChatroomIdOrderByCreatedAtDesc(chatroomId)
                        .orElseThrow(EntityNotFoundException::new);

                String recentChatContent = recentChat.getContent();
                String nickname = opponent.getNickname();
                String profileUrl = opponent.getProfileUrl();
                LocalDateTime createdAt = recentChat.getCreatedAt();

                RecentChatResponseDTO dto = RecentChatResponseDTO.builder()
                        .recentChat(recentChatContent)
                        .chatroomId(chatroomId)
                        .nickname(nickname)
                        .profileUrl(profileUrl)
                        .createdAt(createdAt)
                        .build();

                recentChatResponseDTO.add(dto);
            } catch (EntityNotFoundException e) {
                RecentChatResponseDTO dto = RecentChatResponseDTO.builder()
                        .recentChat("")
                        .chatroomId(chatroomId)
                        .nickname(opponent.getNickname())
                        .profileUrl(opponent.getProfileUrl())
                        .createdAt(LocalDateTime.now())
                        .build();

                recentChatResponseDTO.add(dto);
            }
        }
        return recentChatResponseDTO;
    }

    public OpponentResponseDTO getOpponent(Long chatroomId, Long currentUserId){
        Chatroom chatroom = chatRoomRepository.findById(chatroomId).orElseThrow(EntityNotFoundException::new);
        User currentUser = userRepository.findById(currentUserId).orElseThrow(EntityNotFoundException::new);

        List<User> participant = chatroom.getParticipant();
        User opponent = participant.get(0).equals(currentUser)
                ? participant.get(1) : participant.get(0);

        return OpponentResponseDTO.builder()
                .id(opponent.getId())
                .nickname(opponent.getNickname())
                .profileUrl(opponent.getProfileUrl())
                .build();
    }

    //개인챗 입장 시 채팅 내역 조회
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
            Long userId = user.getId();
            String profileUrl = user.getProfileUrl();
            String content = chat.getContent();
            LocalDateTime createdAt = chat.getCreatedAt();

            ChatResponseDTO dto = ChatResponseDTO.builder()
                    .nickname(nickname)
                    .userId(userId)
                    .profileUrl(profileUrl)
                    .content(content)
                    .createdAt(createdAt)
                    .build();

            chatDTOList.add(dto);
        }
        return chatDTOList;
    }

    public void saveChat(ChatPayloadDTO payloadDTO) {

        Long userId = payloadDTO.getUserId();
        Long chatroomId = payloadDTO.getChatroomId();
        String content = payloadDTO.getContent();

        User user = userRepository.findById(userId).orElseThrow(EntityNotFoundException::new);
        Chatroom chatroom = chatRoomRepository.findById(chatroomId).orElseThrow(EntityNotFoundException::new);

        Chat chat = Chat.builder()
                .user(user)
                .chatroom(chatroom)
                .content(content)
                .createdAt(LocalDateTime.now())
                .build();

        chatRepository.save(chat);
    }

    public NewChatroomResponseDTO createChatroom(Long requesterId, Long targetId) {
        Long existChatroomId = findExistChatroomId(requesterId,targetId);

        //채팅방 불러오기
        if(existChatroomId != -1L){
            return NewChatroomResponseDTO.builder()
                    .chatroomId(existChatroomId)
                    .p1Id(requesterId)
                    .p2Id(targetId)
                    .build();
        }

        //완전 새로운 채팅방 생성
        User p1 = userRepository.findById(requesterId).orElseThrow(EntityNotFoundException::new);
        User p2 = userRepository.findById(targetId).orElseThrow(EntityNotFoundException::new);

        List<User> participants = List.of(p1, p2);

        Chatroom newChatroom = Chatroom.builder()
                .participant(participants)
                .build();

        chatRoomRepository.save(newChatroom);

        return NewChatroomResponseDTO.builder()
                .chatroomId(newChatroom.getId())
                .p1Id(requesterId)
                .p2Id(targetId)
                .build();
    }
    
    private Long findExistChatroomId(Long requesterId, Long targetId){

        List<Chatroom> participatedChatrooms = chatRoomRepository.findAllByUserId(requesterId);

        User targetUser = userRepository.findById(targetId).orElseThrow(EntityNotFoundException::new);

        for (Chatroom participatedChatroom : participatedChatrooms) {
            if(participatedChatroom.getParticipant().contains(targetUser)){
                return participatedChatroom.getId();
            }
        }

        return -1L;
    }

}