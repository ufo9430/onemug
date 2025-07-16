import React, { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import CommentsModal from "../components/CommentsModal";
import Sidebar from "../components/Sidebar";

const mockPost = {
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
};

const relatedPosts = [
  {
    id: "specialty-coffee-review-2",
    title: "스페셜티 원두 10종 비교 후기 (with 추출 가이드)",
    author: {
      name: "MinJung Kim",
      avatar: "",
      initials: "MK",
    },
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/d5ee4b9e89993eff120520ccacca32438749b014?width=1692",
  },
  {
    id: "specialty-coffee-review-3",
    title: "스페셜티 원두 10종 비교 후기 (with 추출 가이드)",
    author: {
      name: "MinJung Kim",
      avatar: "",
      initials: "MK",
    },
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/d5ee4b9e89993eff120520ccacca32438749b014?width=1692",
  },
];

export default function PostDetail() {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 lg:py-5">
          <h1 className="text-lg lg:text-xl font-semibold text-gray-900">게시글 상세</h1>
        </div>
        {/* Post Content */}
        <div className="flex flex-col lg:flex-row gap-8 max-w-4xl mx-auto p-4 lg:p-8">
          <img
            src={mockPost.image}
            alt={mockPost.title}
            className="w-full lg:w-96 h-64 object-cover rounded-lg shadow-md"
          />
          <div className="flex-1 flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2">{mockPost.title}</h2>
            <p className="text-gray-600 mb-4 line-clamp-3">{mockPost.description}</p>
            <div className="flex items-center gap-2">
              <div className="bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700 font-medium">
                {mockPost.author.category}
              </div>
              <div className="flex items-center gap-2 ml-4">
                <span className="font-semibold text-gray-800">{mockPost.author.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <button
                className={`flex items-center gap-1 text-sm ${liked ? "text-red-500" : "text-gray-500"}`}
                onClick={() => setLiked((prev) => !prev)}
              >
                <Heart className="w-5 h-5" />
                {mockPost.likes + (liked ? 1 : 0)}
              </button>
              <button
                className="flex items-center gap-1 text-sm text-gray-500"
                onClick={() => setShowComments(true)}
              >
                <MessageCircle className="w-5 h-5" />
                {mockPost.comments}
              </button>
            </div>
          </div>
        </div>
        {/* Related Posts */}
        <div className="max-w-4xl mx-auto p-4 lg:p-8">
          <h3 className="text-lg font-semibold mb-4">관련 게시글</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">{post.title}</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-semibold text-gray-800">{post.author.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Comments Modal */}
        {showComments && (
          <CommentsModal open={showComments} onClose={() => setShowComments(false)} />
        )}
      </div>
    </div>
  );
}

