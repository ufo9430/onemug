package com.onemug.notice.repository;

import com.onemug.global.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {

    List<Notice> findAllByReceiverId(Long userId);
    boolean existsByReceiverIdAndIsReadFalse(Long receiverId); //읽지 않은 알림 존재 여부 확인
}
