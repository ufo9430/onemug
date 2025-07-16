package com.onemug.community.repository;

import com.onemug.global.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRoomUserTempRepository extends JpaRepository<User, Long> {
}
