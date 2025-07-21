package com.onemug.user.service;

import com.onemug.global.entity.User;
import com.onemug.global.utils.NicknameGenerator;
import com.onemug.user.dto.UserRequestDto;
import com.onemug.user.dto.UserResponseDto;
import com.onemug.user.dto.UserUpdateRequestDto;
import com.onemug.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final NicknameGenerator nicknameGenerator;

    // 회원 가입
    public UserResponseDto register(UserRequestDto userRequestDto) {

        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        if (!Pattern.matches(emailRegex, userRequestDto.email())) {
            throw new IllegalArgumentException("올바르지 않은 이메일 형식입니다: " + userRequestDto.email());
        }

        if (userRequestDto.password() == null || userRequestDto.password().isBlank()) {
            throw new IllegalArgumentException("비밀번호는 필수입니다.");
        }

        if (userRepository.findByEmail(userRequestDto.email()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다: " + userRequestDto.email());
        }

        String nickname = userRequestDto.nickname() != null ? userRequestDto.nickname() : nicknameGenerator.generate();

        User user = User.builder()
                .email(userRequestDto.email())
                .password(passwordEncoder.encode(userRequestDto.password()))
                .nickname(nickname)
                .build();

        return UserResponseDto.from(userRepository.save(user));

    }

    // 회원 정보 수정
    @Transactional
    public UserResponseDto updateUser(Long id, UserUpdateRequestDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 유저를 찾을 수 없습니다: " + id));

        if (dto.password() != null && !dto.password().isBlank()) {
            if (dto.currentPassword() == null || !passwordEncoder.matches(dto.currentPassword(), user.getPassword())) {
                throw new IllegalArgumentException("기존 비밀번호가 일치하지 않습니다.");
            }
        }

        User updated = user.toBuilder()
                .nickname(dto.nickname() != null ? dto.nickname() : user.getNickname())
                .profileUrl(dto.profileUrl() != null ? dto.profileUrl() : user.getProfileUrl())
                .password(dto.password() != null && !dto.password().isBlank()
                        ? passwordEncoder.encode(dto.password())
                        : user.getPassword())
                .build();

        return UserResponseDto.from(userRepository.save(updated));
    }

    // 회원 정보 조회
    public UserResponseDto findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("사용자를 찾을 수 없습니다: " + id));

        if (user == null) {
            throw new NoSuchElementException("사용자를 찾을 수 없습니다: " + id);
        }
        return UserResponseDto.from(user);
    }

    // 회원 삭제
    @Transactional
    public void deleteUser(Long id) {
        if (userRepository.findById(id) == null) {
            throw new NoSuchElementException("존재하지 않는 사용자입니다: " + id);
        }
        userRepository.deleteById(id);

    }

    // 이메일 중복
    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }
}
