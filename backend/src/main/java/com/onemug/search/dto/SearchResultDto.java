package com.onemug.search.dto;

import com.onemug.global.entity.Post;
import com.onemug.global.entity.Creator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;


/**
 * 통합 검색 결과 DTO
*/
public record SearchResultDto(
        Long id,
        String title,
        String excerpt,
        String categoryName,
        String creatorNickname,
        SearchTarget type
) {

        /** Post → DTO 변환 */
        public static SearchResultDto fromPost(Post p) {
                String body = p.getContent();
                String excerpt = body.length() > 120 ? body.substring(0, 120) + "…" : body;

                return new SearchResultDto(
                        p.getId(),
                        p.getTitle(),
                        excerpt,
                        p.getCategory().getName(),
                        p.getCreator().getUser().getNickname(),
                        SearchTarget.POST
                );
        }

        /** Creator → DTO 변환 */
        public static SearchResultDto fromCreator(Creator c) {
                return new SearchResultDto(
                        c.getId(),
                        c.getUser().getNickname(),
                        c.getIntroduceText(),
                        null,
                        c.getUser().getNickname(),
                        SearchTarget.CREATOR
                );
        }
        /*  페이지 두 개를 한 Page 로 병합  -------------------------- */
        public static Page<SearchResultDto> merge(Page<SearchResultDto> posts,
                                                  Page<SearchResultDto> creators,
                                                  Pageable pageable) {

                List<SearchResultDto> merged = new ArrayList<>(
                        posts.getContent().size() + creators.getContent().size());

                // 점수 필드가 따로 없으므로, DB-정렬(각 Page 내부)이 유지되는 순서대로 단순 연결
                Stream.concat(posts.getContent().stream(), creators.getContent().stream())
                        .forEach(merged::add);

                return new PageImpl<>(merged,
                        pageable,
                        posts.getTotalElements() + creators.getTotalElements());
        }
}
