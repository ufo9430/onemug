package com.onemug.postviewloguser.repository;

import com.onemug.global.entity.PostViewLogUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostViewLogUserRepository extends JpaRepository<PostViewLogUser, Long> {

    @Query("SELECT p FROM post_view_log_user p WHERE p.userId = :userId ORDER BY p.viewedAt DESC")
    List<PostViewLogUser> findRecentViewLogsByUserId(Long userId);
}
