import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Heart, MessageCircle, Edit, Trash2 } from "lucide-react";
import CreatorSidebar from "../components/CreatorSidebar";
import CommentsModal from "../components/CommentsModal";

const RelatedPostCard = ({ id, title, category, likes, comments, image }) => {
  const navigate = useNavigate();
  return (
    <article
      onClick={() => navigate(`/creator/post/${id}`)}
      className="bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="aspect-[2/1] bg-gray-100">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2">{title}</h3>
        <p className="text-xs text-gray-500 mb-2">{category}</p>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            <span>{likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            <span>{comments}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default function CreatorPostDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showComments, setShowComments] = useState(false);
  const relatedPosts = [
    {
      id: "2",
      title: "서울 연남동 감성 카페 5곳 탐방기",
      category: "카페 탐방",
      likes: 58,
      comments: 9,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/046f2ae61e6518636b365c38adedfca50dab039b?width=456",
    },
    {
      id: "3",
      title: "나만의 수제 바닐라라떼 레시피 공개",
      category: "카페 레시피 공유",
      likes: 94,
      comments: 13,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/64fde26dbc24bb798c9f6d2ce660d06347b79740?width=456",
    },
    {
      id: "4",
      title: "카페를 하면서 제일 후회한 3가지",
      category: "창업/운영",
      likes: 172,
      comments: 23,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/2a82513b6c8f716b4e8e8de2a4e9f521f674b1b9?width=456",
    },
  ];

  return (
    <div className="min-h-screen bg-brand-secondary flex">
      <CreatorSidebar activeItem="dashboard" />
      <div className="flex-1">
        <header className="h-[73px] bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center">
            <div className="lg:hidden mr-4">
              <h2 className="text-lg font-bold text-gray-900">OneMug</h2>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">게시글 상세</h1>
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded-lg bg-brand-primary text-white font-medium hover:bg-opacity-90 transition-colors flex items-center gap-1"
              onClick={() => {}}
            >
              <Edit className="w-4 h-4" />수정
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors flex items-center gap-1"
              onClick={() => {}}
            >
              <Trash2 className="w-4 h-4" />삭제
            </button>
          </div>
        </header>
        <main className="p-8">
          {/* Post Content (임시) */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">게시글 제목</h2>
            <div className="text-gray-700 mb-4">게시글 내용이 여기에 표시됩니다.</div>
            <div className="flex gap-4">
              <button
                className="px-4 py-2 rounded-lg bg-brand-primary text-white font-medium hover:bg-opacity-90 transition-colors"
                onClick={() => setShowComments(true)}
              >
                댓글 보기
              </button>
            </div>
          </div>
          {/* Related Posts */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">관련 게시글</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedPosts.map((post) => (
                <RelatedPostCard key={post.id} {...post} />
              ))}
            </div>
          </div>
        </main>
        <CommentsModal open={showComments} onClose={() => setShowComments(false)} />
      </div>
    </div>
  );
}
