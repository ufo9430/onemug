import React, { useEffect, useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import CommentsModal from "../components/CommentsModal";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  );
};

const PostDetail = () => {
  const [showComments, setShowComments] = useState(false);
  const { id } = useParams();
  const [postData, setPostData] = useState(null);
  const [liked, setLiked] = useState(false); // true or false
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const navigate = useNavigate();

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const relatedPosts = [
    {
      title: "서울 연남동 감성 카페 5곳 탐방기",
      category: "카페 탐방",
      likes: 58,
      comments: 9,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/046f2ae61e6518636b365c38adedfca50dab039b?width=456",
    },
    {
      title: "나만의 수제 바닐라라떼 레시피 공개",
      category: "카페 레시피 공유",
      likes: 94,
      comments: 13,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/64fde26dbc24bb798c9f6d2ce660d06347b79740?width=456",
    },
    {
      title: "카페를 하면서 제일 후회한 3가지",
      category: "창업/운영",
      likes: 172,
      comments: 23,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/2a82513b6c8f716b4e8e8de2a4e9f521f674b1b9?width=456",
    },
  ];

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/post/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPostData(response.data);
        setLiked(response.data.liked);
        setLikeCount(response.data.likeCount);
        console.log("response.data = ", response.data);
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchComments = async (id) => {
      try {
        const res = await axios.get(`http://localhost:8080/post/${id}/comments`);
        setCommentCount(res.data.length); // 댓글 개수 저장
        console.log("res.data", res.data);
      } catch (err) {
        console.error("❌ 댓글 불러오기 실패", err);
      }
    };
    fetchComments(id);
  }, [id]);

  if (!postData) return <div>Loading...</div>;

  const formattedDate = new Date(postData.createdAt).toLocaleDateString(
    "ko-KR",
    {
      year: "numeric",
      month: "long",
      day: "2-digit",
    },
  );

  const handleLikeToggle = async () => {
    try {
      if (liked) {
        await axios.delete(`http://localhost:8080/post/${id}/like`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLikeCount((prev) => prev - 1);
      } else {
        await axios.post(
          `http://localhost:8080/post/${id}/like`,
          {},
          {   
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setLikeCount((prev) => prev + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
    }
  };

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
                <button
                  type="button"
                  className="focus:outline-none"
                  onClick={() => navigate(`/profile/${postData.creator_id}`)}
                  style={{ padding: 0, border: "none", background: "none" }}
                >
                  <img
                    src={postData.profile_url || "/default-profile.png"}
                    alt={postData.authorName}
                    className="w-12 h-12 rounded-full object-cover bg-yellow-300"
                  />
                </button>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {postData.authorName}
                  </h3>
                  <div className="text-sm text-gray-500">
                    • {postData.categoryName} • {formattedDate}
                  </div>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                {postData.title}
              </h1>

              {/* Article Body */}
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {postData.content}
                </p>
              </div>

              {/* Interaction Buttons */}
              <div className="flex items-center gap-6 mt-8 pt-8 border-t border-gray-200">
                <button
                  onClick={handleLikeToggle}
                  className={`flex items-center justify-center w-14 h-14 rounded-full border ${
                    liked
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 bg-white"
                  } shadow-sm hover:shadow-md transition-shadow`}
                >
                  <Heart
                    className={`w-5 h-5 ${liked ? "text-red-500 fill-red-500" : "text-gray-500"}`}
                  />
                </button>
                <span className="text-sm text-gray-500">{likeCount}</span>
                <button
                  onClick={() => setShowComments(true)}
                  className="flex items-center justify-center w-14 h-14 rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow ml-4"
                >
                  <MessageCircle className="w-5 h-5 text-gray-500" />
                </button>
                <span className="text-sm text-gray-500">{commentCount}</span>
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
  );
};

export default PostDetail;
