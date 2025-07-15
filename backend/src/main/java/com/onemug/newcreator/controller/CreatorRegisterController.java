package com.onemug.newcreator.controller;

import com.onemug.newcreator.service.CreatorRegisterService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/c/register")
public class CreatorRegisterController {
    @Autowired
    private CreatorRegisterService service;

    @PostMapping
    public ResponseEntity<String> register(HttpServletRequest request, HttpServletResponse response){

        String introduce = request.getParameter("introduce");

        if (introduce == null) {
            return ResponseEntity.status(409).body("parameter 찾을수 없음");
        }
        //todo : 임시
        Long userId = 1L;

        if(service.checkAlreadyExist(userId)){
            return ResponseEntity.status(409).body("창작자 계정 중복");
        }

        service.register(introduce, userId);

        return ResponseEntity.ok("성공");
    }
}
