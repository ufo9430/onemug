package com.onemug.newcreator.repository;

import com.onemug.global.entity.Creator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

// 임시 생성, 추후 다른 브랜치와 통합
@Repository
public interface CreatorRegisterRepository extends JpaRepository<Creator, Long> {
    boolean existsByUserId(Long userId);
    Optional<Creator> findByUserId(Long userId);
}
