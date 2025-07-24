package com.onemug.insight.controller;

import com.onemug.insight.service.InsightService;
import com.onemug.user.model.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/c/insight")
@CrossOrigin(value = "http://localhost:3000")
public class InsightController {
    @Autowired
    private InsightService insightService;

    @GetMapping
    public ResponseEntity<Map<String,Object>> getInsights(@RequestParam Long days, Authentication authentication){
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long userId = Long.valueOf(authentication.getName());

        return ResponseEntity.ok(insightService.getInsights(userId, days));
    }
}