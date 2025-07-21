package com.onemug.search.controller;

import com.onemug.search.dto.SearchCond;
import com.onemug.search.dto.SearchResultDto;
import com.onemug.search.dto.SearchTarget;
import com.onemug.search.service.SearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/search")
@Tag(name = "Search")
public class SearchController {

    private final SearchService searchService;

    /**
     * 통합 검색 (post / creator / all)
     * 쿼리스트링 예) /search?q=ai&categoryIds=1,2&target=post&page=0&size=20
     */
    @Operation(summary = "통합 검색")
    @GetMapping
    public ResponseEntity<Page<SearchResultDto>> search(
            @RequestParam(value = "q", required = false, defaultValue = "") String q,
            @RequestParam(value = "categoryIds", required = false) Set<Long> categoryIds,
            @RequestParam(value = "target", defaultValue = "POST") SearchTarget target,
            @ParameterObject Pageable pageable
    ) {
        // 빈 q("")일 때는 searchService 내부에서 전체 조회로 처리하도록 구현 필요
        SearchCond cond = new SearchCond(q, categoryIds, target);
        Page<SearchResultDto> result = searchService.search(cond, pageable);
        return ResponseEntity.ok(result);
    }
}