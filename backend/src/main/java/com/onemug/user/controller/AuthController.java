package com.onemug.user.controller;

import com.onemug.user.dto.SignDto;
import com.onemug.user.service.AuthService;
import com.onemug.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final AuthService authService;

    // 일반 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody SignDto signDto) {
        String token = authService.login(signDto.getEmail(), signDto.getPassword());
        return ResponseEntity.ok(Map.of("token", token));
    }

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignDto dto) {
        try {
            userService.register(dto);
            return ResponseEntity.ok("회원가입 성공");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
