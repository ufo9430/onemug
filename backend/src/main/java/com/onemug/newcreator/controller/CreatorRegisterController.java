package com.onemug.newcreator.controller;

import com.onemug.newcreator.repository.CreatorRegisterRepository;
import com.onemug.global.entity.Creator;
import com.onemug.global.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/c/register")
public class CreatorRegisterController {
    @Autowired
    private CreatorRegisterRepository repository;

    @PostMapping
    public ResponseEntity<String> register(HttpServletRequest request, HttpServletResponse response,
                                            Authentication authentication){
        //임시 작성
        User user = User.builder()
                .user_id(1L)
                .build();

        String introduce = request.getParameter("introduce");

        if(introduce == null){
            return ResponseEntity.status(409).body("parameter not found");
        }

        Creator newCreator = Creator.builder()
                .user(user)
                .introduceText(introduce)
                .build();

        repository.save(newCreator);

        return ResponseEntity.ok("success" + " " + introduce);
    }
}
