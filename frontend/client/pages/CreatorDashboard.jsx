import React from "react"
import { useNavigate } from "react-router-dom"
import { Heart, MessageCircle, Users, Calendar } from "lucide-react"
import CreatorSidebar from "../components/CreatorSidebar"

const PostCard = ({
  id,
  title,
  excerpt,
  category,
  likes,
  comments,
  image,
  author
}) => {
  const navigate = useNavigate()

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
        <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
          {title}
        </h2>

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
  )
}

const CreatorDashboard = () => {
  const navigate = useNavigate()

  const samplePost = {
    id: "1",
    title: "스페셜티 원두 10종 비교 후기 (with 추출 가이드)",
    excerpt:
      "같은 생두라도 로스터마다 풍미가 어떻게 달라지는지 비교했습니다. 홈카페 유저와 바리스타 모두에게 유용한 정리입니다.",
    category: "원두 · 기기 리뷰",
    likes: 124,
    comments: 18,
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/d5ee4b9e89993eff120520ccacca32438749b014?width=1692",
    author: "MinJung Kim"
  }

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
            onClick={() => navigate("/creator/post/new")}
            className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors"
          >
            새 글 작성
          </button>
        </header>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 px-6">
          <div className="flex gap-1">
            <button className="bg-brand-primary text-white px-3 py-2 rounded-lg text-sm font-medium">
              홈
            </button>
            <button
              onClick={() => navigate("/creator/membership")}
              className="bg-gray-50 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              멤버십
            </button>
          </div>
        </div>

        {/* Content Area */}
        <main className="bg-brand-secondary min-h-[calc(100vh-73px-57px)] p-6">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Profile Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
              <div className="flex items-start gap-8">
                {/* Profile Image */}
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/192179915dd19e9acf6b9a2e604eb2eb230b7df2?width=240"
                  alt="김민정"
                  className="w-30 h-30 rounded-full"
                />

                {/* Profile Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    김민정
                  </h2>

                  {/* Stats */}
                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-gray-600" />
                      <span className="text-lg font-semibold text-gray-900">
                        1,247
                      </span>
                      <span className="text-gray-600">구독자</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-gray-900">
                        6
                      </span>
                      <span className="text-gray-600">게시글</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-600">
                        2023년 3월 21일 가입
                      </span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    커피를 사랑하는 바리스타이자 홈카페 전문가입니다. 스페셜티
                    커피와 추출 기법에 대한 깊이 있는 콘텐츠를 제공합니다.
                  </p>

                  {/* Edit Profile Button */}
                  <button className="bg-brand-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors">
                    프로필 편집
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Posts Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                최근 게시글
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <PostCard {...samplePost} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default CreatorDashboard
