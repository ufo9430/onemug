package com.onemug.newcreator.repository;

import com.onemug.global.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CreatorTempUserRepository extends JpaRepository<User, Long> {
}
