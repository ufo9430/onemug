package com.onemug.user.service;

import com.onemug.global.entity.User;
import com.onemug.global.utils.NicknameGenerator;
import com.onemug.user.dto.SignDto;
import com.onemug.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final NicknameGenerator nicknameGenerator;

    // 회원 가입
    public User register(SignDto signDto) {

        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        if (!Pattern.matches(emailRegex, signDto.getEmail())) {
            throw new IllegalArgumentException("올바르지 않은 이메일 형식입니다: " + signDto.getEmail());
        }

        if (signDto.getPassword() == null || signDto.getPassword().isBlank()) {
            throw new IllegalArgumentException("비밀번호는 필수입니다.");
        }

        if (userRepository.findByEmail(signDto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다: " + signDto.getEmail());
        }

        String nickname = nicknameGenerator.generate();

        User user = User.builder()
                .email(signDto.getEmail())
                .password(passwordEncoder.encode(signDto.getPassword()))
                .nickname(nickname)
                .build();

        return userRepository.save(user);

    }

    // 회원 정보 수정
    @Transactional
    public User updateUser(Long id, User user) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 유저를 찾을 수 없습니다: " + id));

        User updated = existingUser.toBuilder()
                .nickname(user.getNickname() != null ? user.getNickname() : existingUser.getNickname())
                .profileUrl(user.getProfileUrl() != null ? user.getProfileUrl() : existingUser.getProfileUrl())
                .password(user.getPassword() != null ? user.getPassword() : existingUser.getPassword())
                .build();

        return userRepository.save(updated);
    }

    // 회원 정보 조회
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    // 회원 삭제
    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);

    }
}
