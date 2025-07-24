package com.onemug.search.service;

import com.onemug.Post.repository.PostRepository;
import com.onemug.feed.repository.CreatorRepository;
import com.onemug.search.dto.SearchCond;
import com.onemug.search.dto.SearchResultDto;
import com.onemug.search.dto.SearchTarget;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
@Service
@RequiredArgsConstructor
public class SearchService {

    private final PostRepository    postRepo;
    private final CreatorRepository creatorRepo;

    /**
     * cond.target() 에 따라 글·창작자·통합 검색 수행
     */
    public Page<SearchResultDto> search(SearchCond cond, Pageable pageable) {
        return switch (cond.target()) {
            case POST -> postRepo.searchPosts(
                    cond.q(),
                    cond.categoryIds() == null ? null : new ArrayList<>(cond.categoryIds()),
                    pageable
            ).map(SearchResultDto::fromPost);

            case CREATOR -> creatorRepo.searchCreators(cond, pageable)
                    .map(SearchResultDto::fromCreator);

            case ALL -> SearchResultDto.merge(
                    postRepo.searchPosts(
                            cond.q(),
                            cond.categoryIds() == null ? null : new ArrayList<>(cond.categoryIds()),
                            pageable
                    ).map(SearchResultDto::fromPost),
                    creatorRepo.searchCreators(cond, pageable).map(SearchResultDto::fromCreator),
                    pageable
            );

        };
    }
}
