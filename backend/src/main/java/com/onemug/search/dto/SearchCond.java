package com.onemug.search.dto;

import java.util.Set;

/**
 *  - q            : 검색어 (필수)
 *  - categoryIds  : null 이면 전체
 *  - target       : POST | CREATOR | ALL
 */
public record SearchCond(
        String q,
        Set<Long> categoryIds,
        SearchTarget target      // enum 정의: POST, CREATOR, ALL
) {}