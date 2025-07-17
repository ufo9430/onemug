import React from "react"
import Sidebar from "@/components/Sidebar"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Heart, MessageCircle } from "lucide-react"

const mockPosts = [
  {
    id: "specialty-coffee-recent-1",
    title: "스페셜티 원두 10종 비교 후기 (with 추출 가이드)",
    description:
      "같은 생두라도 로스터마다 풍미가 어떻게 달라지는지 비교했습니다. 홈카페 유저와 바리스타 모두에게 유용한 정리입니다.",
    author: {
      name: "MinJung Kim",
      category: "원두 · 기기 리뷰",
      avatar: "",
      initials: "MK"
    },
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/d5ee4b9e89993eff120520ccacca32438749b014?width=1692",
    likes: 124,
    comments: 18
  },
  {
    id: "specialty-coffee-recent-2",
    title: "스페셜티 원두 10종 비교 후기 (with 추출 가이드)",
    description:
      "같은 생두라도 로스터마다 풍미가 어떻게 달라지는지 비교했습니다. 홈카페 유저와 바리스타 모두에게 유용한 정리입니다.",
    author: {
      name: "MinJung Kim",
      category: "원두 · 기기 리뷰",
      avatar: "",
      initials: "MK"
    },
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/d5ee4b9e89993eff120520ccacca32438749b014?width=1692",
    likes: 124,
    comments: 18
  }
]

export default function Recent() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeItem="recent" />

      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 lg:py-5">
          <h1 className="text-lg lg:text-xl font-semibold text-gray-900">
            최근 본 글
          </h1>
        </div>

        {/* Content */}
        <div className="flex-1 bg-gray-50 p-4 lg:p-6">
          <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8">
            {mockPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
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
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 lg:p-6">
        {/* Author Info */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10 bg-brand-primary">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback className="bg-brand-primary text-white font-semibold text-sm">
              {post.author.initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-gray-900 text-sm lg:text-base">
              {post.author.name}
            </div>
            <div className="flex items-center gap-1 text-xs lg:text-sm text-gray-500">
              <span>•</span>
              <span>{post.author.category}</span>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 leading-tight">
          {post.title}
        </h2>
        <p className="text-sm lg:text-base text-gray-600 leading-relaxed mb-4">
          {post.description}
        </p>

        {/* Post Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-gray-500">
            <Heart className="w-5 h-5" />
            <span className="text-sm">{post.likes}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{post.comments}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
