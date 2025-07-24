package com.onemug.managesubscriber.controller;

import com.onemug.managesubscriber.dto.SubscribersResponseDTO;
import com.onemug.managesubscriber.service.ManageSubscriberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/c/manage-subscriber")
public class ManageSubscriberController {
    @Autowired
    private ManageSubscriberService subscriberService;

    @GetMapping
    public ResponseEntity<List<SubscribersResponseDTO>> browseSubscribers(Authentication authentication){
        //todo: 임시
        Long userId = 1L;
//        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//
//        Long userId = Long.valueOf(authentication.getName());

        return ResponseEntity.ok(subscriberService.getSubscribers(userId));
    }
}
