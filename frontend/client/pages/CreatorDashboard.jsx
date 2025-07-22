import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Users } from "lucide-react";
import axios from "@/lib/axios";

const PostCard = ({
  id,
  title,
  excerpt,
  category,
  likes,
  comments,
  image,
  author,
}) => {
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`/creator/post/${id}`)}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
    >
      {/* Hero Image */}
      <div className="aspect-[4/2] bg-gray-100">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Author */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-brand-primary"></div>
          <div>
            <div className="font-semibold text-gray-900">{author}</div>
            <div className="text-sm text-gray-500">• {category}</div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
          {title}
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{excerpt}</p>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-gray-600">
            <Heart className="w-4 h-4" />
            <span className="text-sm">{likes}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">{comments}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

const CreatorDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/dashboard/me`);
        setProfile(res.data);
      } catch (err) {
        console.error("❌ 크리에이터 프로필 요청 실패", err);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      console.log("profile", profile)
      if(!profile) return;
      try {
        const res = await axios.get(`/user/${profile.creatorId}/posts`);
        console.log("res.data", res.data);

        setPosts(res.data.content);
      } catch (err) {
        console.error("❌ 게시글 불러오기 실패", err);
      }
    };

    fetchPosts();
  }, [profile]);

  const samplePost = {
    id: "1",
    title: "스페셜티 원두 10종 비교 후기 (with 추출 가이드)",
    excerpt:
      "같은 생두라도 로스터마다 풍미가 어떻게 달라지는지 비교했습니다. 홈카페 유저와 바리스타 모두에게 유용한 정리입니다.",
    category: "원두 · 기기 리뷰",
    likes: 124,
    comments: 18,
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/d5ee4b9e89993eff120520ccacca32438749b014?width=1692",
    author: "MinJung Kim",
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
            <h1 className="text-xl font-semibold text-gray-900">대시보드</h1>
          </div>
          <button
            onClick={() => navigate("/creator/post/new")}
            className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors"
          >
            새 글 작성
          </button>
        </header>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 px-6">
          <div className="flex gap-1">
            <button className="bg-brand-primary text-white px-3 py-2 rounded-lg text-sm font-medium">
              홈
            </button>
            <button
              onClick={() => navigate("/creator/membership")}
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
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
              <div className="flex items-start gap-8">
                {/* Profile Image */}
                <img
                  src={
                    profile?.profileUrl
                      ? `/api${profile.profileUrl}`
                      : "/default-profile.png"
                  }
                  alt={profile?.nickname || "프로필 이미지"}
                  className="w-[120px] h-[120px] rounded-full object-cover bg-gray-100"
                />

                {/* Profile Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {profile?.nickname}
                  </h2>

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

                  {/* Edit Profile Button */}
                  <button
                    className="bg-brand-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors"
                    onClick={() => navigate("/creator/settings")}
                  >
                    프로필 편집
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Posts Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                최근 게시글
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {posts.map(post => (
                    <PostCard
                        key={post.id}
                        id={post.id}
                        title={post.title}
                        excerpt={post.content}
                        category={post.category.name}
                        likes={post.likeCount}
                        comments={post.commentCount ?? 0} // commentCount가 없다면 기본 0
                        image={post.creator.user.profileImage}
                        author={post.creator.user.nickname}
                    />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreatorDashboard;
