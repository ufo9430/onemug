// src/client/pages/Feed.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@shared/api";               // axios 인스턴스
import Sidebar from "../components/Sidebar";

// ───────────────────────────────────────────────────
// PostCard 컴포넌트
// ───────────────────────────────────────────────────
const PostCard = ({
  id,
  title,
  excerpt,
  author,
  category,
  likes,
  comments,
  image,
  authorAvatar
}) => {
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`/post/${id}`)}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
    >
      {/* Hero Image */}
      <div className="aspect-[4/2] bg-gray-100">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Author */}
        <div className="flex items-center gap-3 mb-6">
          <img
            src={authorAvatar || "/placeholder-avatar.svg"}
            alt={author}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="font-semibold text-gray-900">{author}</div>
            <div className="text-sm text-gray-500">• {category}</div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2">
          {title}
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 mb-6 line-clamp-2">{excerpt}</p>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-gray-600 hover:text-brand-primary transition-colors">
            <Heart className="w-5 h-5" />
            <span className="text-sm">{likes}</span>
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:text-brand-primary transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{comments}</span>
          </button>
        </div>
      </div>
    </article>
  );
};

// ───────────────────────────────────────────────────
// Feed 페이지
// ───────────────────────────────────────────────────
const Feed = ({ hasCreatorAccount = false }) => {
  // TODO: 실제 로그인 유저 ID 를 전역 상태(RTK/Context)에서 받아오세요.
  const userId = localStorage.getItem("userId") || 1;

  const { data, isLoading, isError, error } = useQuery({
   queryKey: ["feed", userId],               // 캐시 키
    queryFn: () =>                             // 실제 호출 함수
      api
        .get("/feed", { params: { user: userId, page: 0, size: 20 } })
        .then(res => res.data)
        .catch(err => {
          console.error("피드 로드 실패:", err);
          throw err;
        }),
    staleTime: 1000 * 60 * 5,                  // 5분 동안 신선 데이터로 간주
    keepPreviousData: true,                    // 페이지 전환 시 기존 데이터 유지
  })

  if (isLoading) {
    return <div className="p-8 text-center">피드를 불러오는 중...</div>;
  }
  if (isError) {
    return <div className="p-8 text-center text-red-500">피드 로드 실패</div>;
  }

  // Spring Data Page 구조: content 에 실제 array
  const posts = data?.content || [];

  return (
    <div className="min-h-screen bg-brand-secondary flex">

      {/* 메인 */}
      <div className="flex-1">
        {/* 헤더 */}
        <header className="h-[73px] bg-white border-b border-gray-200 flex items-center px-6">
          <div className="lg:hidden mr-4">
            <h2 className="text-lg font-bold text-gray-900">OneMug</h2>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">피드</h1>
        </header>

        {/* 콘텐츠 */}
        <main className="bg-brand-secondary min-h-[calc(100vh-73px)] p-4 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8">
            {posts.length === 0 ? (
              <div className="py-16 text-center text-gray-500 text-lg">
                좋아하는 창작자를 구독해보세요
              </div>
            ) : (
              posts.map(post => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  excerpt={post.content?.slice(0, 100) + "…"}
                  author={post.creatorNickname}
                  category={post.categoryName || "카테고리 미정"}
                  likes={post.likeCount}
                  comments={post.commentCount || 0}
                  image={post.coverImageUrl || "/placeholder.svg"}
                  authorAvatar={post.creatorAvatarUrl}
                />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Feed;
