package com.onemug.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class SubController {
    @GetMapping("/test")
    public String test(Authentication authentication) {
        return "인증된 사용자: " + authentication.getName();
    }

    @PostMapping("/profile-image")
    public ResponseEntity<?> uploadProfileImage(@RequestParam MultipartFile file, Authentication authentication) {
        String imageUrl = "/images/default-profile.jpg";
        return ResponseEntity.ok(Map.of("profileUrl", imageUrl));
    }
}
