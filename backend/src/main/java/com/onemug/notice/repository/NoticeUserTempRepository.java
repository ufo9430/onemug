package com.onemug.notice.repository;

import com.onemug.global.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

//todo: 임시
@Repository
public interface NoticeUserTempRepository extends JpaRepository<User, Long> {
}
