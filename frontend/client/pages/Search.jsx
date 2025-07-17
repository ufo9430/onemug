import React from "react"
import { Heart, MessageCircle } from "lucide-react"
import Sidebar from "../components/Sidebar"

const Search = () => {
  const categories = [
    { id: "all", label: "전체", active: true },
    { id: "coffee", label: "원두 · 기기 리뷰", active: false },
    { id: "business", label: "비즈니스", active: false },
    { id: "cooking", label: "요리", active: false },
    { id: "dev", label: "개발", active: false },
    { id: "lifestyle", label: "라이프스타일", active: false },
    { id: "travel", label: "여행", active: false },
    { id: "health", label: "건강", active: false }
  ]

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
        "https://cdn.builder.io/api/v1/image/assets/TEMP/d5ee4b9e89993eff120520ccacca32438749b014?width=1692"
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
        "https://cdn.builder.io/api/v1/image/assets/TEMP/d5ee4b9e89993eff120520ccacca32438749b014?width=1692"
    }
  ]

  return (
    <div className="min-h-screen bg-brand-secondary flex">
      {/* Sidebar */}
      <Sidebar activeItem="search" />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="h-[73px] bg-white border-b border-gray-200 flex items-center px-6">
          <div className="lg:hidden mr-4">
            <h2 className="text-lg font-bold text-gray-900">OneMug</h2>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">탐색</h1>
        </header>

        {/* Content Area */}
        <main className="bg-brand-secondary min-h-[calc(100vh-73px)] p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Categories */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                카테고리
              </h2>
              <div className="flex flex-wrap gap-3">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      category.active
                        ? "bg-brand-primary text-white"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Posts Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                오늘의 인기 게시글
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                오늘 가장 많이 조회된 게시글들을 확인해보세요
              </p>

              <div className="space-y-6">
                {samplePosts.map(post => (
                  <article
                    key={post.id}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                  >
                    {/* Hero Image */}
                    <div className="aspect-[4/2] bg-gray-100">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Author */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-brand-primary"></div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {post.author}
                          </div>
                          <div className="text-sm text-gray-500">
                            • {post.category}
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 text-gray-600 hover:text-brand-primary transition-colors">
                          <Heart className="w-5 h-5" />
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-brand-primary transition-colors">
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm">{post.comments}</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Search
