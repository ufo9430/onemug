package com.onemug.user.controller;

import com.onemug.user.dto.LoginRequestDto;
import com.onemug.user.dto.LoginResponseDto;
import com.onemug.user.dto.UserRequestDto;
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
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequestDto) {
        String token = authService.login(loginRequestDto.email(), loginRequestDto.password());
        return ResponseEntity.ok(new LoginResponseDto(token));
    }

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserRequestDto userRequestDto) {
        try {
            userService.register(userRequestDto);
            return ResponseEntity.ok("회원가입 성공");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 이메일 중복 체크
    @PostMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestBody Map<String, String> request) {
        boolean exists = userService.existsByEmail(request.get("email"));
        return ResponseEntity.ok(Map.of("exists", exists));
    }

}
