import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Upload } from "lucide-react";
import CreatorSidebar from "../components/CreatorSidebar";

export default function CreatePostPublish() {
  const navigate = useNavigate();
  const location = useLocation();
  const { title, category, content } = (location.state) || {};

  const [visibility, setVisibility] = useState("");
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const visibilityOptions = [
    { value: "public", label: "전체 공개" },
    { value: "subscribers", label: "구독자 공개" },
    { value: "members", label: "멤버십 회원 공개" },
    { value: "private", label: "비공개" },
  ];

  React.useEffect(() => {
    if (!title || !category || !content) {
      navigate("/creator/post/new");
    }
  }, [title, category, content, navigate]);

  const handleThumbnailUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrevious = () => {
    navigate("/creator/post/new", {
      state: { title, category, content },
    });
  };

  const handlePublish = () => {
    if (visibility) {
      // 실제로는 백엔드로 데이터 전송
      console.log("Publishing post:", {
        title,
        category,
        content,
        visibility,
        thumbnail,
      });
    }
  };

  return (
    <div className="min-h-screen bg-brand-secondary flex">
      <CreatorSidebar activeItem="publish" />
      <div className="flex-1">
        <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-8 xl:p-10">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">게시물 발행</h1>
            <button
              className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-2 px-4 rounded"
              onClick={handlePublish}
            >
              발행하기
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              공개 범위
            </label>
            <div className="relative">
              <button
                className="bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded inline-flex items-center"
                onClick={() => setShowVisibilityDropdown(!showVisibilityDropdown)}
              >
                {visibilityOptions.find((option) => option.value === visibility)?.label || "공개 범위 선택"}
                <ChevronDown className="ml-2" />
              </button>
              {showVisibilityDropdown && (
                <ul className="absolute bg-white border shadow-md p-2 w-full">
                  {visibilityOptions.map((option) => (
                    <li key={option.value}>
                      <button
                        className="block w-full text-left p-2 hover:bg-gray-100"
                        onClick={() => {
                          setVisibility(option.value);
                          setShowVisibilityDropdown(false);
                        }}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              썸네일 이미지
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailUpload}
              className="block w-full text-sm text-gray-700"
            />
            {thumbnailPreview && (
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="mt-2 w-full h-48 object-cover"
              />
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              게시물 제목
            </label>
            <p className="text-gray-700">{title}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              게시물 내용
            </label>
            <p className="text-gray-700">{content}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              게시물 카테고리
            </label>
            <p className="text-gray-700">{category}</p>
          </div>
          <button
            className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-2 px-4 rounded"
            onClick={handlePrevious}
          >
            이전 단계로
          </button>
        </div>
      </div>
    </div>
  );
}
