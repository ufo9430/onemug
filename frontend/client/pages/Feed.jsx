import React from "react"
import { useNavigate } from "react-router-dom"
import { Heart, MessageCircle } from "lucide-react"
import Sidebar from "../components/Sidebar"

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
  const navigate = useNavigate()
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
  )
}

const Feed = ({ hasCreatorAccount = false }) => {
  const samplePosts = [
    {
      id: "1",
      title: "스페셜티 원두 10종 비교 후기 (with 추출 가이드)",
      excerpt:
        "같은 생두라도 로스터마다 풍미가 어떻게 달라지는지 비교했습니다. 홈카페 유저와 바리스타 모두에게 유용한 정리입니다.",
      author: "MinJung Kim",
      category: "원두 · 기기 리뷰",
      likes: 124,
      comments: 18,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/d5ee4b9e89993eff120520ccacca32438749b014?width=1692",
      authorAvatar: ""
    },
    {
      id: "2",
      title: "스페셜티 원두 10종 비교 후기 (with 추출 가이드)",
      excerpt:
        "같은 생두라도 로스터마다 풍미가 어떻게 달라지는지 비교했습니다. 홈카페 유저와 바리스타 모두에게 유용한 정리입니다.",
      author: "MinJung Kim",
      category: "원두 · 기기 리뷰",
      likes: 124,
      comments: 18,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/d5ee4b9e89993eff120520ccacca32438749b014?width=1692",
      authorAvatar: ""
    }
  ]

  return (
    <div className="min-h-screen bg-brand-secondary flex">
      {/* Sidebar */}
      <Sidebar hasCreatorAccount={hasCreatorAccount} activeItem="feed" />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="h-[73px] bg-white border-b border-gray-200 flex items-center px-6">
          <div className="lg:hidden mr-4">
            <h2 className="text-lg font-bold text-gray-900">OneMug</h2>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">피드</h1>
        </header>

        {/* Content Area */}
        <main className="bg-brand-secondary min-h-[calc(100vh-73px)] p-4 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8">
            {samplePosts.map(post => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Feed
