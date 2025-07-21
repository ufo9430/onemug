package com.onemug.user.controller;

import com.onemug.global.entity.User;
import com.onemug.user.model.CustomUserDetails;
import com.onemug.user.service.CustomUserDetailsService;
import com.onemug.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.function.LongToDoubleFunction;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    private final CustomUserDetailsService userDetailsService;

    // 회원 정보 조회
    @GetMapping("/{id}") 
    public Optional<User> findById(@PathVariable Long id) {
        return userService.findById(id);
    }

    //프로필 정보 리액트 전송용 api
    @GetMapping("/profile")
    public ResponseEntity<Map<String,Object>> getProfile(Authentication authentication){
//        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails)) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
//        Long userId = userDetails.getUser().getId();
        //todo:임시
        Long userId = 1L;

        Map<String, Object> profile = userDetailsService.getProfile(userId);

        return ResponseEntity.ok(profile);
    }

    // 회원 정보 수정
    @PreAuthorize("#id.toString() == authentication.name")
    @PutMapping("/{id}") 
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    // 회원 삭제
    @PreAuthorize("#id.toString() == authentication.name")
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }


}
