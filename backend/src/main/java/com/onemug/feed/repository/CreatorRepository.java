package com.onemug.feed.repository;

import com.onemug.global.entity.Creator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CreatorRepository extends JpaRepository<Creator, Long> {

    /** 내가 구독한 Creator id 목록 */
    @Query("""
        select c.id
        from Creator c
        join c.subscriber s
        where s.id = :userId
    """)
    List<Long> findCreatorIdsBySubscriberId(@Param("userId") Long userId);
}
