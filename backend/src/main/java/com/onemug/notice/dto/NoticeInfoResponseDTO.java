package com.onemug.notice.dto;


import com.onemug.global.entity.NoticeType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NoticeInfoResponseDTO {
    private Long noticeId;
    private String targetUserNickname; // 알림 대상(알림 발생시킨) 유저 닉네임
    private String targetUserProfileUrl; // 알림 대상(알림 발생시킨) 유저 프로필 URL
    private String content; // 알림 내용 (noticeType에 들어있는 메시지 내용)
    private Long targetId; // 알림 생성된 글이나 멤버십 ID
    private String targetName; // 알림 생성된 글의 제목이나 멤버십 이름
    private LocalDateTime createdAt; //알림 생성일
    private boolean isRead; //읽음 여부
    private String noticeType; //알림 종류

}
