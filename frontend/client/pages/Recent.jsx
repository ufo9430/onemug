import React, { useEffect, useState } from "react"
import axios from "@/lib/axios";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Heart, MessageCircle } from "lucide-react"

export default function Recent({ userId }) {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    axios
      .get(`/api/post-view-log-user/recent`)
      .then(res => {
        // API 응답이 배열인지 객체인지 확인
        // 예를 들어, 만약 { content: [...] } 형식이라면
        const data = Array.isArray(res) ? res : res.data || []
        setPosts(data)
      })
      .catch(err => {
        console.error("최근 본 글 불러오기 실패", err)
        setPosts([]) // 에러 시 빈 배열 세팅
      })
  }, [userId])

  if (!Array.isArray(posts) || posts.length === 0)
    return <div>최근 본 글이 없습니다.</div>

  return (
    <div className="flex min-h-screen bg-gray-50">
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
            {posts.map(postViewLog => (
              <PostCard key={postViewLog.id} postViewLog={postViewLog} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PostCard({ postViewLog }) {
  return (
    <article className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer p-4">
      <h2 className="text-lg font-bold mb-2">글 ID: {postViewLog.postId}</h2>
      <p className="text-sm text-gray-500 mb-1">
        최근 본 시간: {new Date(postViewLog.viewedAt).toLocaleString()}
      </p>
    </article>
  )
}
