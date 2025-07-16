import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Heart, MessageCircle, Edit, Trash2 } from "lucide-react"
import CreatorSidebar from "../components/CreatorSidebar"
import CommentsModal from "../components/CommentsModal"

const RelatedPostCard = ({ id, title, category, likes, comments, image }) => {
  const navigate = useNavigate()

  return (
    <article
      onClick={() => navigate(`/creator/post/${id}`)}
      className="bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="aspect-[2/1] bg-gray-100">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2">
          {title}
        </h3>
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
  )
}

const CreatorPostDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [showComments, setShowComments] = useState(false)

  const relatedPosts = [
    {
      id: "2",
      title: "서울 연남동 감성 카페 5곳 탐방기",
      category: "카페 탐방",
      likes: 58,
      comments: 9,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/046f2ae61e6518636b365c38adedfca50dab039b?width=456"
    },
    {
      id: "3",
      title: "나만의 수제 바닐라라떼 레시피 공개",
      category: "카페 레시피 공유",
      likes: 94,
      comments: 13,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/64fde26dbc24bb798c9f6d2ce660d06347b79740?width=456"
    },
    {
      id: "4",
      title: "카페를 하면서 제일 후회한 3가지",
      category: "창업/운영",
      likes: 172,
      comments: 23,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/2a82513b6c8f716b4e8e8de2a4e9f521f674b1b9?width=456"
    }
  ]

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
            <h1 className="text-xl font-semibold text-gray-900">글 상세</h1>
          </div>
          <button
            onClick={() => navigate("/creator/post/new")}
            className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors"
          >
            새 글 작성
          </button>
        </header>

        {/* Content Area */}
        <main className="bg-white">
          <div className="max-w-6xl mx-auto">
            {/* Hero Image */}
            <div className="aspect-[12/5] bg-gray-100">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/a5af160bb53272a83dd70637d621caac6810e26a?width=1904"
                alt="Post hero"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Post Content */}
            <div className="p-8">
              {/* Author & Meta Info */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/6539a7b51be212286986ed75ddba09863d0830dc?width=96"
                    alt="김민정"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">김민정</div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <span>5분 읽기</span>
                      <span>•</span>
                      <span>원두 · 기기 리뷰</span>
                      <span>•</span>
                      <span>2024년 1월 15일</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-gray-500 hover:text-gray-700 text-sm">
                    <Edit className="w-4 h-4 inline mr-1" />
                    수정
                  </button>
                  <button className="text-red-500 hover:text-red-700 text-sm">
                    <Trash2 className="w-4 h-4 inline mr-1" />
                    삭제
                  </button>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                스페셜티 원두 10종 비교 후기 (with 추출 가이드)
              </h1>

              {/* Excerpt */}
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                같은 생두라도 로스터마다 풍미가 어떻��� 달라지는지 비교했습니다.
                홈카페 유저와 바리스타 모두에게 유용한 정리입니다.
              </p>

              {/* Content */}
              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-gray-700 leading-relaxed mb-6">
                  안녕하세요, 커피를 사랑하는 여러분! 오늘은 정말 특별한 리뷰를
                  준비했습니다. 지난 한 달간 10개의 서로 다른 로스터리에서 같은
                  생두(에티오피아 예가체프 G1)를 구매해서 직접 비교 테스팅을
                  진행했어요.
                </p>

                {/* Content Image */}
                <div className="aspect-[5/3] bg-gray-100 rounded-lg overflow-hidden mb-6">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/80f000c642a1c9e726fd73f625fb6fc2ea2a1514?width=1472"
                    alt="Coffee comparison"
                    className="w-full h-full object-cover"
                  />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  주요 발견사항
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  블루보틀은 깔끔한 산미, 스타벅스는 바디감이 좋았고, 로컬
                  로스터리 A가 가장 인상적이었습니다. 같은 생두라도 로스터의
                  철학에 따라 완전히 다른 커피가 된다는 것을 확인했어요.
                </p>
              </div>

              {/* Interaction Buttons */}
              <div className="flex items-center gap-4 mb-8">
                <button className="flex items-center gap-2 bg-gray-50 text-gray-600 px-4 py-3 rounded-full hover:bg-gray-100 transition-colors border border-gray-200">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm font-medium">124</span>
                </button>
                <button
                  onClick={() => setShowComments(true)}
                  className="flex items-center gap-2 bg-gray-50 text-gray-600 px-4 py-3 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">18</span>
                </button>
              </div>

              {/* Related Posts Section */}
              <div className="bg-brand-secondary p-8 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  김민정님의 다른 글
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map(post => (
                    <RelatedPostCard key={post.id} {...post} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Comments Modal */}
      {showComments && <CommentsModal onClose={() => setShowComments(false)} />}
    </div>
  )
}

export default CreatorPostDetail
