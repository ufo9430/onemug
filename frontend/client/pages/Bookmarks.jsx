import React, { useEffect, useState } from "react"
import axios from "axios"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Heart, MessageCircle } from "lucide-react"

export default function Bookmarks() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    // userId 5로 예시, 실제로는 로그인 유저 id로 바꾸기
    axios
      .get("/api/users/liked-posts")
      .then((res) => setPosts(res))
      .catch((err) => console.error(err))
  }, [])

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
              <p className="text-center text-gray-500">좋아요한 게시글이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function PostCard({ post }) {
  return (
    <article className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer">
      {/* Hero Image */}
      <div className="aspect-[2/1] overflow-hidden">
        {/* 게시글 이미지가 없다면 기본 이미지 넣어주세요 */}
        <img
          src={post.image || "https://via.placeholder.com/600x300?text=No+Image"}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
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
            {/* 카테고리 필드가 있으면 보여주면 좋아요 */}
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
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-gray-500">
            <Heart className="w-5 h-5" />
            <span className="text-sm">{post.likeCount}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">댓글 수 미구현</span>
          </div>
        </div>
      </div>
    </article>
  )
}
