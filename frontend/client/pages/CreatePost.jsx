import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronDown, Image, Video } from "lucide-react"

const CreatePost = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [content, setContent] = useState("")
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

  const categories = [
    "원두 · 기기 리뷰",
    "카페 탐방",
    "레시피 공유",
    "창업/운영",
    "홈카페 팁"
  ]

  const handleNext = () => {
    if (title && category && content) {
      // Navigate to publishing options page
      navigate("/creator/post/publish", {
        state: { title, category, content }
      })
    }
  }

  const handleCancel = () => {
    navigate("/creator/dashboard")
  }

  return (
    <div className="min-h-screen bg-brand-secondary flex">

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="h-[73px] bg-white border-b border-gray-200 flex items-center px-6">
          <div className="lg:hidden mr-4">
            <h2 className="text-lg font-bold text-gray-900">OneMug</h2>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">글 작성</h1>
        </header>

        {/* Content Area */}
        <main className="bg-brand-secondary min-h-[calc(100vh-73px)] p-6 flex justify-center">
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm p-8">
            {/* Title */}
            <div className="mb-6">
              <label className="block text-base font-semibold text-gray-900 mb-2">
                제목
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="글 제목을 입력하세요"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-base font-semibold text-gray-900 mb-2">
                카테고리
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent flex items-center justify-between"
                >
                  <span
                    className={category ? "text-gray-900" : "text-gray-400"}
                  >
                    {category || "카테고리를 선택하세요"}
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>

                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => {
                          setCategory(cat)
                          setShowCategoryDropdown(false)
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="mb-8">
              <label className="block text-base font-semibold text-gray-900 mb-2">
                본문
              </label>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Toolbar */}
                <div className="bg-gray-50 border-b border-gray-200 p-3 flex items-center gap-2">
                  <button className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded bg-white text-sm hover:bg-gray-50 transition-colors">
                    <Image className="w-4 h-4" />
                    이미지
                  </button>
                  <button className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded bg-white text-sm hover:bg-gray-50 transition-colors">
                    <Video className="w-4 h-4" />
                    동영상
                  </button>
                  <span className="text-xs text-gray-500 ml-auto">
                    파일을 드래그하��� 업로드하거나 버튼을 클릭하세요
                  </span>
                </div>

                {/* Content Area */}
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="내용을 입력하세요..."
                  className="w-full h-96 p-4 resize-none focus:outline-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="px-8 py-3 bg-gray-300 text-white rounded-lg text-lg font-medium hover:bg-gray-400 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleNext}
                disabled={!title || !category || !content}
                className="px-8 py-3 bg-brand-primary text-white rounded-lg text-lg font-medium hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default CreatePost
