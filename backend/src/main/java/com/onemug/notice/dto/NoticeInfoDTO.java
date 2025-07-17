package com.onemug.notice.dto;

import com.onemug.global.entity.Notice;
import com.onemug.global.entity.Post;
import com.onemug.global.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

//Notice.NoticeType noticeType, User targetUser, Post targetPost, List<User> receivers

@Setter
@Getter
@AllArgsConstructor
public class NoticeInfoDTO {

    private Notice.NoticeType noticeType;

    private User targetUser;

    private Post targetPost;

    private List<User> receivers;
}
