package com.onemug.user.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
public class SubController {
    @GetMapping("/api/test")
    public String test(Authentication authentication) {
        return "인증된 사용자: " + authentication.getName();
    }

    @PostMapping("/profile-image")
    public ResponseEntity<?> uploadProfileImage(@RequestParam MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String fileName = UUID.randomUUID() + extension;

        String savePath = new ClassPathResource("static/image/profile").getFile().getAbsolutePath();

        Path filePath = Paths.get(savePath, fileName);
        file.transferTo(filePath.toFile());

        String imageUrl = "/image/profile/" + fileName;

        return ResponseEntity.ok(Map.of("profileUrl", imageUrl));
    }
}
