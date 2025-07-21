import React, { useState } from "react"
import { Heart, MessageCircle } from "lucide-react"
import CommentsModal from "../components/CommentsModal"

const RelatedPostCard = ({ title, category, likes, comments, image }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <img src={image} alt={title} className="w-full h-24 object-cover" />
      <div className="p-3">
        <h3 className="font-medium text-sm text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>
        <div className="text-xs text-gray-500 mb-2">{category}</div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
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
    </div>
  )
}

const PostDetail = () => {
  const [showComments, setShowComments] = useState(false)

  const relatedPosts = [
    {
      title: "서울 연남동 감성 카페 5곳 탐방기",
      category: "카페 탐방",
      likes: 58,
      comments: 9,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/046f2ae61e6518636b365c38adedfca50dab039b?width=456"
    },
    {
      title: "나만의 수제 바닐라라떼 레시피 공개",
      category: "카페 레시피 공유",
      likes: 94,
      comments: 13,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/64fde26dbc24bb798c9f6d2ce660d06347b79740?width=456"
    },
    {
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

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="h-[73px] bg-white border-b border-gray-200 flex items-center px-6">
          <h1 className="text-xl font-semibold text-gray-900">글 상세</h1>
        </header>

        {/* Content Area */}
        <main className="bg-white min-h-[calc(100vh-73px)]">
          {/* Article */}
          <article className="border-b border-gray-200">
            {/* Hero Image */}
            <div className="w-full h-[400px] bg-gray-100">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/a5af160bb53272a83dd70637d621caac6810e26a?width=1904"
                alt="Post hero"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Content */}
            <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
              {/* Author Info */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-yellow-300"></div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    신유���
                  </h3>
                  <div className="text-sm text-gray-500">
                    • 원두 · 기기 리뷰 • 2024년 1월 15일
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                스페셜티 원두 10종 비교 후기 (with 추출 가이드)
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                같은 생두라도 로스터마다 풍미가 어떻게 달라지는지 비교했습니다.
                홈카페 유저와 바리스타 모두에게 유용한 정리입니다.
              </p>

              {/* Article Body */}
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  안녕하세요, 커피를 사랑하는 여러분! 오늘은 정말 특별한 리뷰를
                  준비했습니다. 지난 한 달간 10개의 서로 다른 로스터리에서 같은
                  생두(에티오피아 예가체프 G1)를 구매해서 직접 비교 테스팅을
                  진행했어요.
                </p>

                <div className="my-8">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/80f000c642a1c9e726fd73f625fb6fc2ea2a1514?width=1472"
                    alt="Coffee comparison"
                    className="w-full rounded-lg"
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
              <div className="flex items-center gap-6 mt-8 pt-8 border-t border-gray-200">
                <button className="flex items-center justify-center w-14 h-14 rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <Heart className="w-5 h-5 text-gray-500" />
                </button>
                <span className="text-sm text-gray-500">124</span>
                <button
                  onClick={() => setShowComments(true)}
                  className="flex items-center justify-center w-14 h-14 rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow ml-4"
                >
                  <MessageCircle className="w-5 h-5 text-gray-500" />
                </button>
                <span className="text-sm text-gray-500">18</span>
              </div>
            </div>
          </article>

          {/* Related Posts */}
          <section className="bg-brand-secondary py-8">
            <div className="max-w-4xl mx-auto px-4 lg:px-8">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">
                김민정님의 다른 글
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {relatedPosts.map((post, index) => (
                  <RelatedPostCard key={index} {...post} />
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Comments Modal */}
      {showComments && <CommentsModal onClose={() => setShowComments(false)} />}
    </div>
  )
}

export default PostDetail
