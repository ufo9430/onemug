package com.onemug.user.service;

import com.onemug.global.entity.User;
import com.onemug.global.jwt.JwtProvider;
import com.onemug.global.utils.NicknameGenerator;
import com.onemug.user.model.GoogleUser;
import com.onemug.user.model.NaverUser;
import com.onemug.user.model.ProviderUser;
import com.onemug.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;
    private final NicknameGenerator nicknameGenerator;
    private final JwtProvider jwtTokenProvider;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> oAuth2UserService = new DefaultOAuth2UserService();
        ClientRegistration clientRegistration = userRequest.getClientRegistration();
        OAuth2User oAuth2User = oAuth2UserService.loadUser(userRequest);

        // 소셜 서비스에 맞게 생성
        ProviderUser providerUser = providerUser(clientRegistration, oAuth2User);
        String email = providerUser.getEmail();

        // 해당 소셜 email로 유저 조회, 없으면 생성
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            String nickname = nicknameGenerator.generate();

            return userRepository.save(
                    User.builder()
                            .email(email)
                            .password(providerUser.getPassword())
                            .nickname(nickname)
                            .build()
            );
        });

        // 조회한 유저 정보대로 jwt 생성
        String token = jwtTokenProvider.createToken(user);

        return new DefaultOAuth2User(
                List.of(new SimpleGrantedAuthority("ROLE_USER")),
                Map.of(
                        "token", token,
                        "email", user.getEmail(),
                        "nickname", user.getNickname()
                ),
                "email"
        );
    }


    public ProviderUser providerUser(ClientRegistration clientRegistration, OAuth2User oAuth2User) {
        String registrationId = clientRegistration.getRegistrationId();
        if (registrationId.equals("google")) {
            return new GoogleUser(oAuth2User, clientRegistration);
        } else if (registrationId.equals("naver")) {
            return new NaverUser(oAuth2User, clientRegistration);

        }
        return null;
    }

}

