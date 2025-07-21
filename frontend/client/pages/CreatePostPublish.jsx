import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ChevronDown, Upload } from "lucide-react"


const CreatePostPublish = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { title, categoryId, content } = location.state || {}

  const [visibility, setVisibility] = useState("")
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false)
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)

  // 로그인 정보로 creatorId를 가져왔다고 가정
  const creatorId = 4

  const visibilityOptions = [
    { value: "public", label: "전체 공개" },
    { value: "subscribers", label: "구독자 공개" },
    { value: "members", label: "멤버십 회원 공개" },
    { value: "private", label: "비공개" }
  ]

  // Redirect if no content from previous step
  React.useEffect(() => {
    if (!title || !categoryId || !content) {
      navigate("/creator/post/new")
    }
  }, [title, categoryId, content, navigate])

  const handleThumbnailUpload = event => {
    const file = event.target.files?.[0]
    if (file) {
      setThumbnail(file)
      const reader = new FileReader()
      reader.onload = e => {
        setThumbnailPreview(e.target?.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePrevious = () => {
    navigate("/creator/post/new", {
      state: { title, categoryId, content }
    })
  }

  const handlePublish = async () => {
    if (!visibility) return;

    const postData = {
      title,
      categoryId,
      content,
      creatorId
      // 필요에 따라 PostCreateRequestDto에 맞게 필드 추가
    };

    try {
      const response = await fetch('http://localhost:8080/c/post/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 인증이 필요하면 예를 들어 토큰 추가
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
        credentials: 'include', // 쿠키 기반 인증이면 포함
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Post created:', data);
        navigate('/creator/dashboard');
      } else {
        // 에러 처리
        console.error('Failed to create post:', response.status);
        // 필요하면 사용자에게 알림 등
      }
    } catch (error) {
      console.error('Error while creating post:', error);
    }
  };

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
            {/* Publishing Options Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                발행 옵션 설정
              </h2>
              <p className="text-gray-500 mb-8">
                글의 공개 범위를 설정해주세요
              </p>

              {/* Visibility Settings */}
              <div className="mb-8">
                <label className="block text-base font-semibold text-gray-900 mb-2">
                  공개 설정
                </label>
                <div className="relative">
                  <button
                    onClick={() =>
                      setShowVisibilityDropdown(!showVisibilityDropdown)
                    }
                    className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent flex items-center justify-between"
                  >
                    <span
                      className={visibility ? "text-gray-900" : "text-gray-500"}
                    >
                      {visibility
                        ? visibilityOptions.find(
                            opt => opt.value === visibility
                          )?.label
                        : "공개 범위를 선택하세요"}
                    </span>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </button>

                  {showVisibilityDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      {visibilityOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setVisibility(option.value)
                            setShowVisibilityDropdown(false)
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Thumbnail Settings Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                썸네일 설정
              </h2>
              <p className="text-gray-500 mb-6">
                게시글 대표 이미지를 선택하세요
              </p>

              {/* Thumbnail Upload */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="file"
                    id="thumbnail"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                  <div className="w-full h-64 border border-gray-200 rounded-lg overflow-hidden bg-gray-100">
                    {thumbnailPreview ? (
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <img
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/278a42e0ce2f9f9df2dcb946db1f459003663f96?width=662"
                          alt="Default thumbnail"
                          className="w-full h-full object-cover opacity-50"
                        />
                        <label
                          htmlFor="thumbnail"
                          className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-black hover:bg-opacity-10 transition-colors"
                        >
                          <div className="text-center">
                            <Upload className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                            <p className="text-sm text-gray-600 font-medium">
                              이미지 변경
                            </p>
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                className="px-8 py-3 border border-gray-200 bg-gray-100 text-gray-700 rounded-lg text-lg font-medium hover:bg-gray-200 transition-colors"
              >
                이전
              </button>

              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="px-8 py-3 bg-gray-300 text-white rounded-lg text-lg font-medium hover:bg-gray-400 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handlePublish}
                  disabled={!visibility}
                  className="px-8 py-3 bg-brand-primary text-white rounded-lg text-lg font-medium hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  발행
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default CreatePostPublish
