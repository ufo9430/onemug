package com.onemug.user.controller;

import com.onemug.global.entity.User;
import com.onemug.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 회원 정보 조회
    @GetMapping("/{id}") 
    public Optional<User> findById(@PathVariable Long id) {
        return userService.findById(id);
    }

    // 회원 정보 수정
    @PreAuthorize("#id.toString() == authentication.name")
    @PutMapping("/{id}") 
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    // 회원 삭제
    @PreAuthorize("#id.toString() == authentication.name")
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }


}
