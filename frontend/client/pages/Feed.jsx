import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

const PostCard = ({
  id,
  title,
  excerpt,
  author,
  category,
  likes,
  comments,
  image,
  authorAvatar,
}) => {
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`/post/${id}`)}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
    >
      <div className="aspect-[4/2] bg-gray-100">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <img
            src={authorAvatar || "/placeholder-avatar.svg"}
            alt={author}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="font-semibold text-gray-900">{author}</div>
            <div className="text-sm text-gray-500">• {category}</div>
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2">
          {title}
        </h2>
        <p className="text-gray-600 mb-6 line-clamp-2">{excerpt}</p>
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
  );
};

const Feed = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // ① 구독자 수 체크(초기엔 null)
  const [subscriptionCount, setSubscriptionCount] = useState(null);

  useEffect(() => {
    // 구독자 수 체크 API 호출
    api.get(`/api/subscriptions/count?userId=${userId}`)
      .then(res => {
        console.log("구독 카운트:", res.data); // 테스트
        setSubscriptionCount(res.data.count); // 예: {count: 0} or {count: 2}
        if (res.data.count === 0) {
          navigate("/explore", { replace: true });
        }
      })
      .catch((err) => {
         console.error("구독자 수 확인 실패", err);
        navigate("/explore", { replace: true });
      });
  }, [userId, navigate]);

  // ② 구독 정보 확인 중일 때
  if (subscriptionCount === null) {
    return <div className="p-8 text-center">구독 정보 확인 중...</div>;
  }

  // ③ 구독자가 1명 이상일 때만 피드 fetch
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["feed", userId],
    queryFn: () =>
      api
        .get("/feed", { params: { user: userId, page: 0, size: 20 } })
        .then((res) => res.data),
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
    enabled: subscriptionCount > 0 // 구독 있을 때만 fetch
  });

  const posts = data?.content ?? [];

  // 로딩 & 에러 처리
  if (isLoading) {
    return <div className="p-8 text-center">피드를 불러오는 중...</div>;
  }
  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        피드 로드 실패: {error?.message || "알 수 없는 오류"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-secondary flex">
      <div className="flex-1">
        <header className="h-[73px] bg-white border-b border-gray-200 flex items-center px-6">
          <div className="lg:hidden mr-4">
            <h2 className="text-lg font-bold text-gray-900">OneMug</h2>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">피드</h1>
        </header>
        <main className="bg-brand-secondary min-h-[calc(100vh-73px)] p-4 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                excerpt={(post.content || "").slice(0, 100) + "…"}
                author={post.creatorNickname}
                category={post.categoryName || "카테고리 미정"}
                likes={post.likeCount}
                comments={post.commentCount || 0}
                image={post.coverImageUrl || "/placeholder.svg"}
                authorAvatar={post.creatorAvatarUrl}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Feed;
