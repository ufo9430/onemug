import React, { useState } from "react";
import { X, Heart } from "lucide-react";

const Comment = ({ comment, isReply = false }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReply = () => {
    if (replyText.trim()) {
      console.log("Reply:", replyText);
      setReplyText("");
      setShowReplyForm(false);
    }
  };

  return (
    <div className={`${isReply ? "ml-12" : ""}`}>
      <div className="flex gap-3 mb-4">
        <img
          src={comment.avatar}
          alt={comment.author}
          className={`${
            isReply ? "w-8 h-8" : "w-10 h-10"
          } rounded-full flex-shrink-0`}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`font-semibold text-gray-900 ${
                isReply ? "text-sm" : "text-base"
              }`}
            >
              {comment.author}
            </span>
            <span
              className={`text-gray-500 ${isReply ? "text-xs" : "text-sm"}`}
            >
              {comment.timeAgo}
            </span>
          </div>
          <div
            className={`text-gray-700 mb-2 ${isReply ? "text-sm" : "text-base"}`}
          >
            {comment.content}
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 text-gray-500 hover:text-red-500">
              <Heart className="w-4 h-4" />
              <span>{comment.likes}</span>
            </button>
            <button
              className="text-blue-500 hover:underline text-xs"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              답글
            </button>
          </div>
          {showReplyForm && (
            <div className="mt-2">
              <input
                type="text"
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                className="border rounded px-2 py-1 text-sm w-full"
                placeholder="답글을 입력하세요"
              />
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded mt-1 text-xs"
                onClick={handleReply}
              >
                답글 등록
              </button>
            </div>
          )}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {comment.replies.map(reply => (
                <Comment key={reply.id} comment={reply} isReply={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentsModal = ({ onClose }) => {
  const [comments, setComments] = useState([
    // 예시 데이터
    {
      id: "1",
      author: "사용자1",
      content: "좋은 글 감사합니다!",
      timeAgo: "2분 전",
      likes: 3,
      avatar: "https://i.pravatar.cc/40?img=1",
      replies: [
        {
          id: "2",
          author: "작성자",
          content: "감사합니다!",
          timeAgo: "1분 전",
          likes: 1,
          avatar: "https://i.pravatar.cc/40?img=2",
        },
      ],
    },
  ]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-4">댓글</h2>
        <div className="space-y-6 max-h-96 overflow-y-auto">
          {comments.map(comment => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
