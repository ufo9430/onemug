import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Mail, MessageCircle, Users } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "@/lib/axios";

const PostCard = ({
  id,
  title,
  content,
  category,
  likesCount,
  viewCount,
  creator,
}) => {
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`/post/${id}`)}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer flex flex-col gap-4"
    >
      {/* Author */}
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage
            src={
              creator?.user?.profileUrl
                ? `http://localhost:8080${creator.user.profileUrl}`
                : "/default-profile.png"
            }
            alt="프로필 이미지"
            className="object-cover"
          />
          <AvatarFallback className="bg-brand-primary text-white font-bold text-sm">
            {creator?.user?.nickname?.charAt(0) || "?"}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold text-gray-900">
            {creator.user?.nickname}
          </div>
          <div className="text-sm text-gray-500">• {category.name}</div>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-lg font-bold text-gray-900 line-clamp-2">{title}</h2>

      {/* Excerpt */}
      <p className="text-gray-600 text-sm line-clamp-2">{content}</p>

      {/* Actions */}
      <div className="flex items-center gap-4 mt-auto">
        <div className="flex items-center gap-1 text-gray-600">
          <Heart className="w-4 h-4" />
          <span className="text-sm">{likesCount}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600">
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">{viewCount}</span>
        </div>
      </div>
    </article>
  );
};

const PostCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-1">
        <Skeleton className="w-1/2 h-4" />
        <Skeleton className="w-1/4 h-3" />
      </div>
    </div>
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <div className="flex items-center gap-4 mt-auto">
      <Skeleton className="w-8 h-4" />
      <Skeleton className="w-8 h-4" />
    </div>
  </div>
);

const CreatorProfile = () => {
  const { creatorId } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/c/${creatorId}`);
        setProfile(res.data);
      } catch (err) {
        console.error("❌ 크리에이터 프로필 요청 실패", err);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/user/${creatorId}/posts`);
        setPosts(res.data.content);
      } catch (err) {
        console.error("❌ 게시글 불러오기 실패", err);
      }
    };

    Promise.all([fetchProfile(), fetchPosts()]).finally(() =>
      setLoading(false),
    );
  }, []);

  const handleMessageClick = async (subscriberId) => {
    // 메시지 보내기 로직 구현
    try {
      const res = await axios.get(`/community/new/${subscriberId}`);
      console.log("메시지 보내기: 구독자 ID", res.data);
      navigate(`/creator/messages/${res.data.chatroomId}`);
    } catch (err) {
      console.error("채팅방 이동 실패", err);
    }
  };

  return (
    <div className="min-h-screen bg-brand-secondary flex">
      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="h-[73px] bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center">
            <div className="lg:hidden mr-4">
              <h2 className="text-lg font-bold text-gray-900">OneMug</h2>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">프로필</h1>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 px-6">
          <div className="flex gap-1">
            <button className="bg-brand-primary text-white px-3 py-2 rounded-lg text-sm font-medium">
              홈
            </button>
            <button
              onClick={() => navigate(`/membership/creator/${creatorId}`)}
              className="bg-gray-50 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              멤버십
            </button>
          </div>
        </div>

        {/* Content Area */}
        <main className="bg-brand-secondary min-h-[calc(100vh-73px-57px)] p-6">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Profile Section */}
            {loading ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                <div className="flex items-start gap-8">
                  <Skeleton className="w-[120px] h-[120px] rounded-full" />
                  <div className="flex-1 space-y-4">
                    <Skeleton className="h-6 w-1/3" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                <div className="flex items-start gap-8">
                  {/* Profile Image */}
                  <Avatar className="w-[120px] h-[120px]">
                    <AvatarImage
                      src={
                        profile?.profileUrl
                          ? `http://localhost:8080${profile?.profileUrl}`
                          : "/default-profile.png"
                      }
                      alt="프로필 이미지"
                      className="object-cover bg-gray-100"
                    />
                    <AvatarFallback className="bg-brand-primary text-white font-semibold text-2xl">
                      {profile?.nickname?.charAt(0) || "닉"}
                    </AvatarFallback>
                  </Avatar>

                  {/* Profile Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {profile?.nickname}
                      </h2>
                      <div
                        className="bg-brand-primary text-white p-1.5 rounded-lg hover:bg-brand-primary/90 transition-colors cursor-pointer"
                        onClick={() => handleMessageClick(profile?.userId)}
                      >
                        <Mail className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-gray-600" />
                        <span className="text-lg font-semibold text-gray-900">
                          {profile?.subscriberCount}
                        </span>
                        <span className="text-gray-600">구독자</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-900">
                          {profile?.postCount}
                        </span>
                        <span className="text-gray-600">게시글</span>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {profile?.introduceText}
                    </p>

                    {/* Membership Button */}
                    <button
                      className="bg-brand-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors"
                      onClick={() =>
                        navigate(`/membership/creator/${creatorId}`)
                      }
                    >
                      멤버십 가입
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Posts Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                최근 게시글
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <PostCardSkeleton key={i} />
                    ))
                  : posts.map((post) => <PostCard key={post.id} {...post} />)}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreatorProfile;
