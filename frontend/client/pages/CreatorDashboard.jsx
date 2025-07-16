import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Users, Calendar } from "lucide-react";
import CreatorSidebar from "../components/CreatorSidebar";

const PostCard = ({
  id,
  title,
  excerpt,
  category,
  likes,
  comments,
  image,
  author,
}) => {
  const navigate = useNavigate();
  return (
    <article
      onClick={() => navigate(`/creator/post/${id}`)}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
    >
      {/* Hero Image */}
      <div className="aspect-[4/2] bg-gray-100">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      {/* Content */}
      <div className="p-6">
        {/* Author */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-brand-primary"></div>
          <div>
            <div className="font-semibold text-gray-900">{author}</div>
            <div className="text-sm text-gray-500">• {category}</div>
          </div>
        </div>
        {/* Title */}
        <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">{title}</h2>
        {/* Excerpt */}
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{excerpt}</p>
        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-gray-600">
            <Heart className="w-4 h-4" />
            <span className="text-sm">{likes}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">{comments}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default function CreatorDashboard() {
  const navigate = useNavigate();
  const samplePost = {
    id: "1",
    title: "스펜티 원두 10종 비교 후기 (with 추출 가이드)",
    excerpt:
      "같은 생두라도 로스터마다 풍미가 어떻게 달라지는지 비교했습니다. 홈카페 유저와 바리스타 모두에게 유용한 정리입니다.",
    category: "원두 · 기기 리뷰",
    likes: 124,
    comments: 18,
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/d5ee4b9e89993eff120520ccacca32438749b014?width=1692",
    author: "MinJung Kim",
  };

  return (
    <div className="min-h-screen bg-brand-secondary flex">
      {/* Creator Sidebar */}
      <CreatorSidebar activeItem="dashboard" />
      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="h-[73px] bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center">
            <div className="lg:hidden mr-4">
              <h2 className="text-lg font-bold text-gray-900">OneMug</h2>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">대시보드</h1>
          </div>
          <button
            className="px-6 py-3 rounded-lg bg-brand-primary text-white font-medium hover:bg-opacity-90 transition-colors"
            onClick={() => navigate("/creator/post/new")}
          >
            새 글 작성
          </button>
        </header>
        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8">
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center">
            <Users className="w-8 h-8 text-brand-primary mb-2" />
            <div className="text-2xl font-bold">1,234</div>
            <div className="text-sm text-gray-500">구독자</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center">
            <MessageCircle className="w-8 h-8 text-brand-primary mb-2" />
            <div className="text-2xl font-bold">567</div>
            <div className="text-sm text-gray-500">댓글</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center">
            <Heart className="w-8 h-8 text-brand-primary mb-2" />
            <div className="text-2xl font-bold">2,345</div>
            <div className="text-sm text-gray-500">좋아요</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center">
            <Calendar className="w-8 h-8 text-brand-primary mb-2" />
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-gray-500">게시글</div>
          </div>
        </section>
        {/* Recent Post */}
        <section className="p-8">
          <h2 className="text-xl font-semibold mb-4">최근 게시글</h2>
          <PostCard {...samplePost} />
        </section>
      </div>
    </div>
  );
}
