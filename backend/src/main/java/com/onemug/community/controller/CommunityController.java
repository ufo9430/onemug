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
    //채팅방 목록 입장 로직 (jpa를 통해 활성화된 채팅방 조회)
    // 프론트엔드 서버에서 /community를 백엔드 서버에 호출했을 때
    // 저희는 유저 세션을 읽어서 - 해당 유저가 속한 채팅방 테이블을 조회하고 - DTO로 변환해서 - 반환하면 됩니다
    @Autowired
    private ChatRoomService chatRoomService;

    @GetMapping
    public List<ChatRoomResponseDTO> findChatRooms(HttpServletRequest request, HttpServletResponse response){

        // todo: 임시
        // 저희 더미데이터입니다(1번 유저 조회했을 때)

        //| chatroom_id | participant_id |
        //+-------------+----------------+
        //|           1 |              1 |
        //|           1 |              2 |

        // | id | content                                             | user_id | created_at          |
        // |  4 | 이번 주말에 카페 투어 갈 사람?                             |       5 | 2025-07-12 09:30:00 |
        // 최근 채팅

        // 결과적으로 저희가 /community를 get했을 땐 1번 채팅방에 4번 채팅이 포함되어 출력되면 됩니다
        Long userId = 1L;

        return chatRoomService.findAll(userId);
    }


    //채팅방 입장(WebSocket으로 서버와 연결)

}
