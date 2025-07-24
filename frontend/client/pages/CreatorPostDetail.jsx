import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Heart, MessageCircle, Edit, Trash2 } from "lucide-react"
import CommentsModal from "../components/CommentsModal"
import axios from "axios";

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
      console.log("Post ID:", id);
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

  const handleEdit = () => {
    navigate("/creator/post/update", { replace: true, state: { postData } });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`http://localhost:8080/c/post/delete/${id}`);
      alert("삭제되었습니다.");
      navigate("/creator/dashboard");
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제에 실패했습니다.");
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
                    <div className="font-semibold text-gray-900">{postData.authorName}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <span>{postData.categoryName}</span>
                      <span>•</span>
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                      className="text-gray-500 hover:text-gray-700 text-sm"
                      onClick={handleEdit}
                  >
                    <Edit className="w-4 h-4 inline mr-1" />
                    수정
                  </button>
                  <button
                      className="text-red-500 hover:text-red-700 text-sm"
                      onClick={() => handleDelete(postData.id)}
                  >
                    <Trash2 className="w-4 h-4 inline mr-1" />
                    삭제
                  </button>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                {postData.title}
              </h1>

              {/* Content */}
              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {postData.content}
                </p>

                {/* Content Image */}
                <div className="aspect-[5/3] bg-gray-100 rounded-lg overflow-hidden mb-6">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/80f000c642a1c9e726fd73f625fb6fc2ea2a1514?width=1472"
                    alt="Coffee comparison"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Interaction Buttons */}
              <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={handleLikeToggle}
                    className={`flex items-center gap-2 bg-gray-50 text-gray-600 px-4 py-3 rounded-full hover:bg-gray-100 transition-colors border border-gray-200 ${
                        liked
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 bg-white"
                    } shadow-sm hover:shadow-md transition-shadow`}
                >
                  <Heart
                      className={`w-5 h-5 ${liked ? "text-red-500 fill-red-500" : "text-gray-500"}`}
                  />
                  <span className="text-sm font-medium">{likeCount}</span>
                </button>
                <button
                  onClick={() => setShowComments(true)}
                  className="flex items-center gap-2 bg-gray-50 text-gray-600 px-4 py-3 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{commentCount}</span>
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
