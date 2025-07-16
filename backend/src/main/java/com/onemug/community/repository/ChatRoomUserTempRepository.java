package com.onemug.community.repository;

import com.onemug.global.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRoomUserTempRepository extends JpaRepository<User, Long> {
}
