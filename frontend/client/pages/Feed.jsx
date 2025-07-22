import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Heart, MessageCircle } from "lucide-react";

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
  const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
  const [subscriptionCount, setSubscriptionCount] = useState(null);

  useEffect(() => {
    if (!userId) {
      navigate("/explore", { replace: true });
      return;
    }
    api.get("/memberships/count", { headers: { "User-Id": userId } })
      .then(res => {
        setSubscriptionCount(res.data);
        if (res.data === 0) {
          navigate("/explore", { replace: true });
        }
      })
      .catch(() => {
        navigate("/explore", { replace: true });
      });
  }, [userId, navigate]);

  // 항상 최상단에서 useQuery 선언 (조건부로 데이터를 fetch할 때는 enabled 사용)
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["feed", userId],
    queryFn: () =>
      api.get("/feed", { params: { user: userId, page: 0, size: 20 } })
        .then((res) => res.data),
    enabled: subscriptionCount > 0 // 구독이 있을 때만 fetch!
  });

  if (subscriptionCount === null) {
    return <div className="p-8 text-center">구독 정보 확인 중...</div>;
  }

  if (isLoading) {
    return <div className="p-8 text-center">피드를 불러오는 중...</div>;
  }

  if (isError) {
    return <div className="p-8 text-center text-red-500">
      피드 로드 실패: {error?.message || "알 수 없는 오류"}
    </div>;
  }

  const posts = data?.content ?? [];

  return (
    <div className="min-h-screen bg-brand-secondary flex">
      {/* ... 이하 동일 */}
      <div className="flex-1">
        {/* ... */}
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
