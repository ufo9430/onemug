import React, { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

import { ChevronLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import axios from "@/lib/axios";

function formatSimpleTime(timestamp) {
  const date = new Date(timestamp);
  let hours = date.getHours();
  const minutes = date.getMinutes();

  const isAm = hours < 12;
  const period = isAm ? "오전" : "오후";

  hours = hours % 12;
  if (hours === 0) hours = 12;

  const formattedMinutes = minutes.toString().padStart(2, '0');

  return `${period} ${hours}:${formattedMinutes}`;
}

function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function formatDateLine(timestamp) {
  const date = new Date(timestamp);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

// {
//     "nickname": "bryan80",
//     "userId": 3,
//     "profileUrl": "https://www.lorempixel.com/499/666",
//     "content": "오늘 커피 맛 정말 좋네요!",
//     "createdAt": "2025-07-12T09:15:00"
//   }

export default function Conversation() {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const [mockUser, setMockUser] = useState(null)
  const [mockMessages, setMockMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const socketRef = useRef(null)
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mockMessages]);

  useEffect(() => {
    const userId = 1 // todo: 임시 사용자 id
    const chatroomId = Number(conversationId)
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
    socketRef.current = socket


    // 대화 상대 정보 불러오기
    axios.get(`/community/${chatroomId}/opponent`)
      .then(res => {
      console.log("대화 상대 정보:", res.data)
      setMockUser(res.data)
      })

    // 채팅 내역 불러오기
    axios.get(`/community/${chatroomId}`)
      .then(res => {
      console.log("이전 채팅 내역:", res.data)
      const formatted = res.data.map(msg => ({
        ...msg,
        isOwn: msg.userId === userId,
        timestamp: formatSimpleTime(msg.createdAt)
      }))

      setMockMessages(formatted)

      setTimeout(() => {
        if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "instant" });
        }
      }, 0);
      })


    // WebSocket 연결 설정
    socket.onopen = () => {
      console.log("WebSocket 연결됨")
    }

    socket.onmessage = event => {
      const message = JSON.parse(event.data);

      const formatted = {
        ...message,
        isOwn: message.userId === userId,
        timestamp: formatSimpleTime(message.createdAt || new Date())
      }

      setMockMessages(prev => [...prev, formatted]);
    };

    socket.onclose = () => {
      console.log("WebSocket 연결 종료")
    }

    socket.onerror = error => {
      console.error("WebSocket 오류:", error)
    }

    return () => {
      socket.close()
    }
  }, [conversationId])


  if (!mockUser) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              대화를 찾을 수 없습니다
            </h2>
            <Button onClick={() => navigate("/messages")}>
              메시지 목록으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    )
  }
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const now = new Date();
      const payload = {
        userId: 1, // 실제 사용자 ID로 교체
        chatroomId: Number(conversationId),
        content: newMessage.trim()
      }

      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify(payload))
        console.log("메시지 전송됨:", payload)
      } else {
        console.warn("WebSocket이 연결되지 않았습니다.")
      }

      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify(payload));

        // UI에 즉시 반영
        setMockMessages(prev => [
          ...prev,
          {
            ...payload,
            nickname: "Me",  // 필요에 따라 수정
            profileUrl: "Me",
            createdAt: now.toISOString(),
            isOwn: true,
            timestamp: formatSimpleTime(now)
          }
        ]);
      }

      setNewMessage("")
    }
  }

  const handleKeyPress = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      <div className="flex-1 flex flex-col w-full lg:w-auto h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 lg:gap-4 min-w-0 flex-1">
              <Avatar className="h-12 w-12 lg:h-16 lg:w-16 flex-shrink-0">
                <AvatarImage src={mockUser.profileUrl} alt={mockUser.nickname} />
                <AvatarFallback className="bg-gray-200 text-gray-600 font-medium text-sm lg:text-lg">
                  {mockUser.nickname.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h1 className="text-lg lg:text-2xl font-semibold text-gray-900 truncate">
                  {mockUser.nickname}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
              <Button onClick={() => navigate("/messages")}
                size="icon"
                variant="outline"
                className="h-8 w-8 lg:h-10 lg:w-10 rounded-lg"
              >
                <ChevronLeft className="h-4 w-4 lg:h-5 lg:w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-3 lg:space-y-4">
          {mockMessages.map((message, index) => {
            const prevMessage = mockMessages[index - 1];
            const currentDate = new Date(message.createdAt);
            const prevDate = prevMessage ? new Date(prevMessage.createdAt) : null;

            const showDateLine = !prevDate || !isSameDay(currentDate, prevDate);

            return (
              <React.Fragment key={index}>
                {showDateLine && (
                  <div className="flex justify-center my-2">
                    <span className="text-xs text-gray-500 px-3 py-1 bg-gray-100 rounded-full">
                      {formatDateLine(message.createdAt)}
                    </span>
                  </div>
                )}

                <div
                  className={`flex gap-2 lg:gap-3 ${message.isOwn ? "justify-end" : "justify-start"}`}
                >
                  {!message.isOwn && (
                    <Avatar className="h-8 w-8 lg:h-10 lg:w-10 flex-shrink-0">
                      <AvatarImage src={mockUser.profileUrl} alt={mockUser.nickname} />
                      <AvatarFallback className="bg-gray-200 text-gray-600 font-medium text-xs lg:text-sm">
                        {mockUser.nickname.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`flex flex-col ${message.isOwn ? "items-end" : "items-start"} max-w-[85%] lg:max-w-md`}
                  >
                    {!message.isOwn && (
                      <span className="text-xs lg:text-sm font-medium text-gray-900 mb-1">
                        {mockUser.nickname}
                      </span>
                    )}

                    <div
                      className={`px-3 lg:px-4 py-2 lg:py-3 rounded-2xl ${message.isOwn
                        ? "bg-brand-primary text-white rounded-br-md"
                        : "bg-gray-100 text-gray-900 rounded-bl-md"
                        }`}
                    >
                      <p className="text-xs lg:text-sm leading-relaxed break-words">
                        {message.content}
                      </p>
                    </div>

                    <span className={`text-xs text-gray-500 mt-1 ${message.isOwn ? "text-right" : "text-left"}`}>
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4 lg:p-6">
          <div className="flex items-end gap-2 lg:gap-3">
            <div className="flex-1 relative">
              <Input
                placeholder="메시지를 입력하세요..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="rounded-3xl border-gray-300 h-10 lg:h-12 text-sm lg:text-base px-4 lg:px-6"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              size="icon"
              className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 flex-shrink-0"
              variant="secondary"
            >
              <Send className="h-4 w-4 lg:h-5 lg:w-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
