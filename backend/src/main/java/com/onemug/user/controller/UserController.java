package com.onemug.user.controller;

import com.onemug.user.dto.UserUpdateRequestDto;
import com.onemug.user.service.CustomUserDetailsService;
import com.onemug.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    private final CustomUserDetailsService userDetailsService;


    // 내 정보 조회
    @GetMapping("/me")
    public ResponseEntity<?> findByMyId(Authentication authentication) {
        Long id = Long.valueOf(authentication.getName());
        return ResponseEntity.ok(userService.findById(id));
    }


    // 회원 정보 조회
    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    //프로필 정보 리액트 전송용 api
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long userId = Long.valueOf(authentication.getName());
        Map<String, Object> profile = userDetailsService.getProfile(userId);

        return ResponseEntity.ok(profile);
    }

    // 회원 정보 수정
    @PreAuthorize("#id.toString() == authentication.name")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserUpdateRequestDto userUpdateRequestDto) {
        try {
            return ResponseEntity.ok(userService.updateUser(id, userUpdateRequestDto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // 회원 삭제
    @PreAuthorize("#id.toString() == authentication.name")
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }


}
