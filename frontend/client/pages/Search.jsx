import React from "react";
import { Heart, MessageCircle } from "lucide-react";
import Sidebar from "../components/Sidebar";

const categories = [
  "원두 · 기기 리뷰",
  "홈카페 레시피",
  "바리스타 노트",
  "카페 창업",
  "이벤트/공지",
];

const mockPosts = [
  {
    id: "specialty-coffee-review",
    title: "스페셜티 원두 10종 비교 후기 (with 추출 가이드)",
    description:
      "같은 생두라도 로스터마다 풍미가 어떻게 달라지는지 비교했습니다. 홈카페 유저와 바리스타 모두에게 유용한 정리입니다.",
    author: {
      name: "MinJung Kim",
      category: "원두 · 기기 리뷰",
      avatar: "",
      initials: "MK",
    },
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/d5ee4b9e89993eff120520ccacca32438749b014?width=1692",
    likes: 124,
    comments: 18,
  },
];

function PostCard({ post }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
      <img
        src={post.image}
        alt={post.title}
        className="w-full md:w-48 h-48 object-cover"
      />
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h2>
          <p className="text-gray-600 mb-4 line-clamp-3">{post.description}</p>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-800">{post.author.name}</span>
            <span className="text-xs text-gray-500">{post.author.category}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 ml-auto">
            <Heart className="w-4 h-4" />
            <span className="text-sm">{post.likes}</span>
            <MessageCircle className="w-4 h-4 ml-4" />
            <span className="text-sm">{post.comments}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Search() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeItem="search" />
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 lg:py-5">
          <h1 className="text-lg lg:text-xl font-semibold text-gray-900">검색</h1>
        </div>
        {/* Categories */}
        <div className="flex gap-2 px-4 py-2 bg-white border-b border-gray-200 overflow-x-auto">
          {categories.map((category) => (
            <span
              key={category}
              className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700 font-medium whitespace-nowrap"
            >
              {category}
            </span>
          ))}
        </div>
        {/* Content */}
        <div className="flex-1 bg-gray-50 p-4 lg:p-6">
          <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8">
            {mockPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

