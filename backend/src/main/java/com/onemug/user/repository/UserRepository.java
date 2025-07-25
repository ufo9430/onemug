package com.onemug.user.repository;

import com.onemug.global.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    void deleteById(Long id);

    Optional<User> findById(Long id);

}
