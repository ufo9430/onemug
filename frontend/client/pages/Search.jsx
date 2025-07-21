// src/pages/Search.jsx
import React, { useState, useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Heart, MessageCircle } from "lucide-react";
import debounce from "lodash.debounce";
import api from "@shared/api";
const PAGE_SIZE = 20;

const Search = () => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const loadMoreRef = useRef(null);

  const fetchSearch = async ({ pageParam = 0 }) => {
    const params = new URLSearchParams();
    params.append("q", query);
    if (activeCategory) params.append("categoryIds", activeCategory);
    params.append("target", "POST");
    params.append("page", pageParam);
    params.append("size", PAGE_SIZE);

    const { data } = await api.get("/search", { params });
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
    queryKey: ["search", query, activeCategory],
    queryFn: fetchSearch,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.number + 1,
  });

  const posts = data ? data.pages.flatMap((p) => p.content) : [];

  // infinite scroll observer
  useEffect(() => {
    if (!hasNextPage || !loadMoreRef.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) fetchNextPage();
    });
    io.observe(loadMoreRef.current);
    return () => io.disconnect();
  }, [hasNextPage, fetchNextPage]);

  const categories = [
    { id: null, label: "전체" },
    { id: 1, label: "원두 · 기기 리뷰" },
    { id: 2, label: "비즈니스" },
    { id: 3, label: "요리" },
    { id: 4, label: "개발" },
    { id: 5, label: "라이프스타일" },
    { id: 6, label: "여행" },
    { id: 7, label: "건강" },
  ];

  const handleInputChange = debounce((e) => setQuery(e.target.value), 300);

  return (
    <div className="min-h-screen bg-brand-secondary flex">
      <div className="flex-1">
        {/* Header */}
        <header className="h-[73px] bg-white border-b border-gray-200 flex items-center px-6 gap-4">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            className="flex-1 text-sm py-2 px-3 border border-gray-300 rounded-md"
            onChange={handleInputChange}
          />
        </header>

        {/* Content */}
        <main className="bg-brand-secondary min-h-[calc(100vh-73px)] p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Categories */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                카테고리
              </h2>
              <div className="flex flex-wrap gap-3">
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

            {/* Results */}
            {isLoading && <p>로딩 중…</p>}
            {isError && <p>{error.message}</p>}

            <div className="space-y-6">
              {posts.map((post) => (
                <article
                  key={`${post.type}-${post.id}`}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                >
                  {/* Optional hero image if backend supplies */}
                  {post.imageUrl && (
                    <div className="aspect-[4/2] bg-gray-100">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-brand-primary" />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {post.creatorNickname}
                        </div>
                        {post.categoryName && (
                          <div className="text-sm text-gray-500">
                            • {post.categoryName}
                          </div>
                        )}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}

                    {post.type === "POST" && (
                      <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 text-gray-600">
                          <Heart className="w-5 h-5" />
                          <span className="text-sm">{post.likeCount}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600">
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm">{post.commentCount}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
              {/* Infinite scroll trigger */}
              {hasNextPage && !isFetchingNextPage && (
                <div ref={loadMoreRef} className="h-1" />
              )}
              {isFetchingNextPage && (
                <p className="text-center py-4">불러오는 중…</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Search;
