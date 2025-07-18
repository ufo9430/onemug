package com.onemug.search.controller;

import com.onemug.search.dto.SearchCond;
import com.onemug.search.dto.SearchResultDto;
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
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<Page<SearchResultDto>> search(@ParameterObject SearchCond cond,
                                                        @ParameterObject Pageable pageable) {
        Page<SearchResultDto> body = searchService.search(cond, pageable);
        return ResponseEntity.ok(body);
    }
}