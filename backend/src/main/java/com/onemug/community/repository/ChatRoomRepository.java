package com.onemug.community.repository;

import com.onemug.global.entity.Chatroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRoomRepository extends JpaRepository<Chatroom, Long> {

    @Query(value = "select c from Chatroom c join c.participant p where p.id = :userId")
    public List<Chatroom> findAllByUserId(Long userId);

}
