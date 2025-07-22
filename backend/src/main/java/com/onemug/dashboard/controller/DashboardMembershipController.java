package com.onemug.dashboard.controller;

import com.onemug.dashboard.dto.CreatorMembershipResponseDTO;
import com.onemug.dashboard.service.DashboardMembershipService;
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
@RequestMapping("/c/membership")
public class DashboardMembershipController {
    @Autowired
    private DashboardMembershipService membershipService;

    @GetMapping
    public ResponseEntity<List<CreatorMembershipResponseDTO>> browseMemberships(Authentication authentication){
//        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//
//        Long userId = Long.valueOf(authentication.getName());
        Long userId = 1L;

        return ResponseEntity.ok(membershipService.browseMemberships(userId));
    }
}
