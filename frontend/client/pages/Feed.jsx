import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";
import Sidebar from "../components/Sidebar";

const PostCard = ({
  id,
  title,
  excerpt,
  author,
  category,
  likes,
  comments,
  image,
  authorAvatar,
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
          <div className="w-10 h-10 rounded-full bg-brand-primary"></div>
          <div>
            <div className="font-semibold text-gray-900">{author}</div>
            <div className="text-sm text-gray-500">• {category}</div>
          </div>
        </div>
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2">{title}</h2>
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

export default function Feed({ hasCreatorAccount = false }) {
  const samplePosts = [
    {
      id: "1",
      title: "스펜티 원두 10종 비교 후기 (with 추출 가이드)",
      excerpt:
        "같은 생두라도 로스터마다 풍미가 어떻게 달라지는지 비교했습니다. 홈카페 유저와 바리스타 모두에게 유용한 정리입니다.",
      author: "MinJung Kim",
      category: "원두 · 기기 리뷰",
      likes: 124,
      comments: 18,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/d5ee4b9e89993eff120520ccacca32438749b014?width=1692",
      authorAvatar: "",
    },
    {
      id: "2",
      title: "스펜티 원두 10종 비교 후기 (with 추출 가이드)",
      excerpt:
        "같은 생두라도 로스터마다 풍미가 어떻게 달라지는지 비교했습니다. 홈카페 유저와 바리스타 모두에게 유용한 정리입니다.",
      author: "MinJung Kim",
      category: "원두 · 기기 리뷰",
      likes: 120,
      comments: 12,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/d5ee4b9e89993eff120520ccacca32438749b014?width=1692",
      authorAvatar: "",
    },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">피드</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {samplePosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </main>
    </div>
  );
}
