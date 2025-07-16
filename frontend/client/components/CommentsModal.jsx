import React, { useState } from "react"
import { X, Heart } from "lucide-react"

const Comment = ({ comment, isReply = false }) => {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText] = useState("")

  const handleReply = () => {
    if (replyText.trim()) {
      console.log("Reply:", replyText)
      setReplyText("")
      setShowReplyForm(false)
    }
  }

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
            className={`text-gray-700 mb-2 ${
              isReply ? "text-sm" : "text-base"
            }`}
          >
            {comment.content}
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-gray-600 hover:text-brand-primary transition-colors">
              <Heart className="w-4 h-4" />
              <span className="text-xs">{comment.likes}</span>
            </button>
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs text-gray-600 hover:text-brand-primary transition-colors"
            >
              답글
            </button>
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="답글을 입력하세요..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                onKeyPress={e => e.key === "Enter" && handleReply()}
              />
              <button
                onClick={handleReply}
                disabled={!replyText.trim()}
                className="px-3 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                답글
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="border-l-2 border-gray-100 pl-6 ml-6">
          {comment.replies.map(reply => (
            <Comment key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  )
}

const CommentsModal = ({ onClose }) => {
  const [newComment, setNewComment] = useState("")

  const comments = [
    {
      id: "1",
      author: "김민정",
      content: "정말 유용한 정보네요! @박지수님도 보시면 좋을 것 같아요.",
      timeAgo: "2분 전",
      likes: 5,
      avatar:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/05d2c67f1e294bbbcb41123ee1061cdb3f030efc?width=80"
    },
    {
      id: "2",
      author: "이준호",
      content: "저도 비슷한 경험이 있어요. 로스터리마다 정말 다르더라구요.",
      timeAgo: "5분 전",
      likes: 2,
      avatar:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/05d2c67f1e294bbbcb41123ee1061cdb3f030efc?width=80",
      replies: [
        {
          id: "3",
          author: "김민정",
          content: "@이준호 맞아요! 어떤 로스터리가 가장 인상적이셨나요?",
          timeAgo: "3분 전",
          likes: 1,
          avatar:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/9557dbcef1edb5e4b90b16b6da78b8c3bb9056d7?width=64"
        }
      ]
    }
  ]

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      console.log("New comment:", newComment)
      setNewComment("")
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">댓글 18개</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {comments.map(comment => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
        </div>

        {/* Comment Input */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex gap-3">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/f6404340e285156f73b1cc9515defcad133c3190?width=80"
              alt="Your avatar"
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                rows={3}
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  댓글 등록
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommentsModal
