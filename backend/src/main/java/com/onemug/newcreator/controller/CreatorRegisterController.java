package com.onemug.newcreator.controller;

import com.onemug.newcreator.service.CreatorRegisterService;
import com.onemug.user.model.CustomUserDetails;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/c/register")
@CrossOrigin("http://localhost:3000")
public class CreatorRegisterController {
    @Autowired
    private CreatorRegisterService service;

    @PostMapping
    public ResponseEntity<String> register(@RequestBody Map<String, String> payload, Authentication authentication){
        Long userId = 4L; //todo: 임시
        if(authentication != null){
            CustomUserDetails userDetail = (CustomUserDetails) authentication.getPrincipal();
            userId = userDetail.getUser().getId();
        }


        String introduce = payload.get("introduce");

        if (introduce == null) {
            return ResponseEntity.status(409).body("parameter 찾을수 없음");
        }

        if(service.checkAlreadyExist(userId)){
            return ResponseEntity.status(409).body("창작자 계정 중복");
        }

        service.register(introduce, userId);

        return ResponseEntity.ok("성공");
    }
}
