package com.onemug.global.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.onemug.community.dto.ChatPayloadDTO;
import com.onemug.community.service.ChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {
    private static final ConcurrentHashMap<String, WebSocketSession> clientSession = new ConcurrentHashMap<>();

    @Autowired
    private ChatRoomService chatService;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        clientSession.put(session.getId(), session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();

        //json 파싱
        ObjectMapper mapper = new ObjectMapper();
        ChatPayloadDTO payloadDTO = mapper.readValue(payload, ChatPayloadDTO.class);

        chatService.saveChat(payloadDTO);

        clientSession.forEach((key, value) -> {
            if(!key.equals(session.getId())) {
                try{
                    value.sendMessage(message);
                }catch (IOException e){
                    e.printStackTrace();
                }
            }
        });
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws IOException {
        clientSession.remove(session);
    }

}
