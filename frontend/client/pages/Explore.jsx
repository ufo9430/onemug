// src/pages/Explore.jsx
import React, { useState, useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { Heart, MessageCircle, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@shared/api";

const PAGE_SIZE = 20;
// const userId = localStorage.getItem("userId");

const categories = [
  { id: null, label: "전체" },
  { id: 1, label: "원두 · 기기 리뷰" },
  { id: 2, label: "카페 탐방" },
  { id: 3, label: "레시피 공유" },
  { id: 4, label: "창업/운영" },
];

const Explore = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [query, setQuery] = useState("");
  const loadMoreRef = useRef(null);
  const navigate = useNavigate();

  const fetchFeed = async ({ pageParam = 0 }) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    console.log("JWT Token:", token);

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    // 탐색 모드 기본 파라미터
    const exploreParams = new URLSearchParams();
    // exploreParams.append("user", userId);
    if (activeCategory !== null) {
      exploreParams.append("category", activeCategory);
    }
    exploreParams.append("page", pageParam);
    exploreParams.append("size", PAGE_SIZE);

    // 검색어 트리밍
    const raw = query.trim();
    // 공백만 입력된 상태면 탐색 모드 그대로
    if (!raw) {
      const { data } = await api.get("/explore", {
        params: exploreParams,
        headers,
      });
      return data;
    }

    // 검색 모드: Boolean 모드 접두사 검색(*) 적용
    const searchParams = new URLSearchParams();
    searchParams.append("q", `${raw}*`);
    if (activeCategory !== null) {
      searchParams.append("categoryIds", activeCategory);
    }
    searchParams.append("target", "POST");
    searchParams.append("page", pageParam);
    searchParams.append("size", PAGE_SIZE);

    const { data } = await api.get("/search", {
      params: searchParams,
      headers,
    });
    return data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["explore", activeCategory, query],
    queryFn: fetchFeed,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      return lastPage.last ? undefined : lastPage.number + 1;
    },
  });

  // 안전하게 content 배열 합치기
  const posts =
    data?.pages
      .filter((p) => p && Array.isArray(p.content))
      .flatMap((p) => p.content) || [];

  // 무한 스크롤 옵저버
  useEffect(() => {
    if (!hasNextPage || !loadMoreRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) fetchNextPage();
    });
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  return (
    <div className="min-h-screen bg-brand-secondary flex">
      <div className="flex-1">
        {/* 헤더: 검색창 + 제목 */}
        <header className="h-[73px] bg-white border-b border-gray-200 flex items-center px-6 gap-4">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            className="flex-1 text-sm py-2 px-3 border border-gray-300 rounded-md"
            onChange={debounce((e) => setQuery(e.target.value), 300)}
          />
        </header>

        <main className="px-6 py-4">
          {/* 카테고리 필터 */}
          <div className="mb-4 overflow-x-auto">
            <div className="inline-flex space-x-2">
              {categories.map((cat) => (
                <button
                  key={cat.id ?? "all"}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat.id
                      ? "bg-brand-primary text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 로딩 / 에러 / 빈 상태 */}
          {isLoading && <p>로딩 중…</p>}
          {isError && <p className="text-red-500">{error.message}</p>}
          {!isLoading && !isError && posts.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              {query.trim()
                ? "검색 결과가 없습니다."
                : "탐색할 게시글이 없습니다."}
            </p>
          )}

          {/* 포스트 리스트 */}
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.id}
                onClick={() => navigate(`/post/${post.id}`)}
                className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
                <p className="text-xs text-gray-500 mb-1">
                  {post.categoryName}
                </p>
                <p className="text-sm text-gray-600 mb-2">{post.summary}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Heart size={16} />
                    <span>{post.likeCount}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle size={16} />
                    <span>{post.commentCount}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye size={16} />
                    <span>{post.viewCount}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* 무한 스크롤 트리거 */}
          {hasNextPage && !isFetchingNextPage && (
            <div ref={loadMoreRef} className="h-1" />
          )}
          {isFetchingNextPage && (
            <p className="text-center py-4">불러오는 중…</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Explore;
