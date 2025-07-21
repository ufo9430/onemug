package com.onemug.user.service;

import com.onemug.global.entity.User;
import com.onemug.newcreator.repository.CreatorRegisterRepository;
import com.onemug.user.model.CustomUserDetails;
import com.onemug.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final CreatorRegisterRepository creatorRepository; //todo: 임시(통합 예정)

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .map(CustomUserDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public Map<String,Object> getProfile(Long userId){

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        boolean isCreator = creatorRepository.existsByUserId(userId);

        Map<String, Object> response = new HashMap<>();

        response.put("userId", userId);
        response.put("nickname", user.getNickname());
        response.put("profileUrl", user.getProfileUrl());
        response.put("email", user.getEmail());
        response.put("isCreator", isCreator);
        return response;
    }
}
