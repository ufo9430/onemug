package com.onemug.newcreator.controller;

import com.onemug.newcreator.dto.CreatorUpdateDto;
import com.onemug.newcreator.service.CreatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/c")
@RequiredArgsConstructor
public class CreatorController {

    private final CreatorService service;

    @GetMapping("{creatorId}")
    public ResponseEntity<?> getCreator(@PathVariable Long creatorId) throws Exception {
        return ResponseEntity.ok(service.findById(creatorId));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCreatorSetting(Authentication authentication){
        Long userId = Long.valueOf(authentication.getName());
        return ResponseEntity.ok(service.findByUserId(userId));
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateCreatorSetting(Authentication authentication, @RequestBody CreatorUpdateDto creatorUpdateDto){
        Long userId = Long.valueOf(authentication.getName());
        return ResponseEntity.ok(service.updateCreator(userId, creatorUpdateDto));
    }

}
