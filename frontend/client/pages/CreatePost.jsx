import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Image, Video } from "lucide-react";
import CreatorSidebar from "../components/CreatorSidebar";

export default function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const categories = [
    "원두 · 기기 리뷰",
    "카페 탐방",
    "레시피 공유",
    "창업/운영",
    "홈카페 팁",
  ];

  const handleNext = () => {
    if (title && category && content) {
      navigate("/creator/post/publish", {
        state: { title, category, content },
      });
    }
  };

  const handleCancel = () => {
    navigate("/creator/dashboard");
  };

  return (
    <div className="min-h-screen bg-brand-secondary flex">
      <CreatorSidebar activeItem="dashboard" />
      <div className="flex-1">
        <header className="h-[73px] bg-white border-b border-gray-200 flex items-center px-6">
          <div className="lg:hidden mr-4">
            <h2 className="text-lg font-bold text-gray-900">OneMug</h2>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">글 작성</h1>
        </header>
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
                onChange={(e) => setTitle(e.target.value)}
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
                  <span className={category ? "text-gray-900" : "text-gray-400"}>
                    {category || "카테고리를 선택하세요"}
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setCategory(cat);
                          setShowCategoryDropdown(false);
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
            <div className="mb-6">
              <label className="block text-base font-semibold text-gray-900 mb-2">
                내용
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent min-h-[120px]"
              />
            </div>
            {/* Actions */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 rounded-lg bg-brand-primary text-white font-medium hover:bg-opacity-90 transition-colors"
                disabled={!title || !category || !content}
              >
                다음
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
