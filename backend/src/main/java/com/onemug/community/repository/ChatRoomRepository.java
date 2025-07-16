package com.onemug.community.repository;

import com.onemug.global.entity.Chat;
import com.onemug.global.entity.Chatroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<Chatroom, Long> {

    @Query(value = "select c from Chatroom c join c.participant p where p.id = :userId")
    public List<Chatroom> findAllByUserId(Long userId);

    @Query(value = "select d from Chatroom c join c.chat d where c.id = :chatroomId order by d.created_at desc limit 1")
    public Optional<Chat> findRecentChatByChatroomId(Long chatroomId);
}
