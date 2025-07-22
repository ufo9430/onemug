import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Eye } from "lucide-react";

export default function Bookmarks() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("/api/users/liked-posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 lg:py-5">
          <h1 className="text-lg lg:text-xl font-semibold text-gray-900">
            좋아요한 게시글
          </h1>
        </div>

        {/* Content */}
        <div className="flex-1 bg-gray-50 p-4 lg:p-6">
          <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8">
            {posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <p className="text-center text-gray-500">
                좋아요한 게시글이 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post }) {
  const navigate = useNavigate();
  // 날짜 포맷 YYYY.MM.DD
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return `${date.getFullYear()}.${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}.${date.getDate().toString().padStart(2, "0")}`;
  };

  return (
    <article
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
      onClick={() => navigate(`/post/${post.id}`)}
    >
      <div className="p-4 lg:p-6">
        {/* Author Info */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10 bg-brand-primary">
            <AvatarFallback className="bg-brand-primary text-white font-semibold text-sm">
              {post.creatorNickname?.[0] || "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-gray-900 text-sm lg:text-base">
              {post.creatorNickname}
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(post.createdAt)}
            </div>
          </div>
        </div>

        {/* Post Content */}
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 leading-tight">
          {post.title}
        </h2>
        <p className="text-sm lg:text-base text-gray-600 leading-relaxed mb-4">
          {post.content}
        </p>

        {/* Post Stats */}
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5" fill="#df2222ff" stroke="#df2222ff" />
            <span>{post.likeCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <span>{post.commentCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <span>{post.viewCount}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
