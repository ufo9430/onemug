package com.onemug.newcreator.controller;

import com.onemug.newcreator.service.CreatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/c")
@RequiredArgsConstructor
public class CreatorController {

    private final CreatorService service;

    @GetMapping("{creatorId}")
    public ResponseEntity<?> getCreator(@PathVariable Long creatorId) throws Exception {
        return ResponseEntity.ok(service.findById(creatorId));
    }
}
