package com.onemug.notice.dto;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NoticeInfoResponseDTO {
    private String targetUserNickname;
    private String targetUserProfileUrl;
    private String content;
    private String targetPostName;


}
