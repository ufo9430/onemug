package com.onemug.feed.controller;
import com.onemug.feed.dto.PostDto;
import com.onemug.feed.service.FeedService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/feed")
@RequiredArgsConstructor
public class FeedController {

    private final FeedService feedService;

    /** [DEV 전용] userId 를 쿼리파라미터로 받는다.  ex) /feed?user=3&page=0&size=20 */
    @GetMapping(params = "user")
    public Page<PostDto> feedDev(@RequestParam("user") Long userId,
                                 @RequestParam(defaultValue = "0") int page,
                                 @RequestParam(defaultValue = "20") int size) {

        return feedService.getFeed(
                userId,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
    }
}
