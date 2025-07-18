package com.onemug.global.utils;

import com.onemug.user.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

// OAuth2User와 UserDetails 모두에게 userId를 추출할 수 있게 하는 유틸 클래스
public class AuthUtils {
    public static Long extractUserId(Object principal, UserRepository userRepository) {
        if (principal instanceof OAuth2User oAuth2User) {
            return userRepository.findByEmail(oAuth2User.getAttribute("email"))
                    .orElseThrow()
                    .getId();
        } else if (principal instanceof UserDetails userDetails) {
            return userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow()
                    .getId();
        } else {
            throw new IllegalArgumentException("Unknown principal type");
        }
    }
}
