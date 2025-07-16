import React, { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Sidebar from "@/components/Sidebar"
import { Phone, ChevronDown, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const mockUsers = {
  "coffee-master": {
    id: "coffee-master",
    name: "Coffee Master",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/103ad23fdec830cc6845a6b15a4ea1458ff7394e?width=128",
    isOnline: true
  }
}

const mockMessages = {
  "coffee-master": [
    {
      id: "1",
      senderId: "coffee-master",
      content: "안녕하세요! 원두 추천 부탁드려요",
      timestamp: "오후 2:30",
      isOwn: false
    },
    {
      id: "2",
      senderId: "current-user",
      content: "안녕하세요! 어떤 맛을 선호하시나요?",
      timestamp: "오후 2:32",
      isOwn: true
    },
    {
      id: "3",
      senderId: "coffee-master",
      content: "산미가 있으면서도 부드러운 맛을 좋아해요",
      timestamp: "오후 2:33",
      isOwn: false
    },
    {
      id: "4",
      senderId: "current-user",
      content:
        "그렇다면 에티오피아 예가체프를 추천드려요. 꽃향기와 함께 밝은 산미가 특징이에요",
      timestamp: "오후 2:35",
      isOwn: true
    },
    {
      id: "5",
      senderId: "coffee-master",
      content: "오 좋네요! 어디서 구매할 수 있나요?",
      timestamp: "오후 2:36",
      isOwn: false
    },
    {
      id: "6",
      senderId: "current-user",
      content: "ㄴㅇㄹㅁㄴㅇ",
      timestamp: "오후 03:17",
      isOwn: true
    },
    {
      id: "7",
      senderId: "current-user",
      content: "ㅇ",
      timestamp: "오후 03:17",
      isOwn: true
    }
  ]
}

export default function Conversation() {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const [newMessage, setNewMessage] = useState("")

  const user = conversationId ? mockUsers[conversationId] : null
  const messages = conversationId ? mockMessages[conversationId] || [] : []

  if (!user) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar activeItem="messages" />
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
      // In a real app, this would send the message to the server
      console.log("Sending message:", newMessage)
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
      <Sidebar activeItem="messages" />

      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 lg:gap-4 min-w-0 flex-1">
              <Avatar className="h-12 w-12 lg:h-16 lg:w-16 flex-shrink-0">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gray-200 text-gray-600 font-medium text-sm lg:text-lg">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h1 className="text-lg lg:text-2xl font-semibold text-gray-900 truncate">
                  {user.name}
                </h1>
                {user.isOnline && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs lg:text-sm text-green-600">
                      온라인
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 lg:h-10 lg:w-10 rounded-lg"
              >
                <Phone className="h-4 w-4 lg:h-5 lg:w-5" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 lg:h-10 lg:w-10 rounded-lg"
              >
                <ChevronDown className="h-4 w-4 lg:h-5 lg:w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-3 lg:space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-2 lg:gap-3 ${
                message.isOwn ? "justify-end" : "justify-start"
              }`}
            >
              {!message.isOwn && (
                <Avatar className="h-8 w-8 lg:h-10 lg:w-10 flex-shrink-0">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-gray-200 text-gray-600 font-medium text-xs lg:text-sm">
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`flex flex-col ${
                  message.isOwn ? "items-end" : "items-start"
                } max-w-[85%] lg:max-w-md`}
              >
                {!message.isOwn && (
                  <span className="text-xs lg:text-sm font-medium text-gray-900 mb-1">
                    {user.name}
                  </span>
                )}

                <div
                  className={`px-3 lg:px-4 py-2 lg:py-3 rounded-2xl ${
                    message.isOwn
                      ? "bg-brand-primary text-white rounded-br-md"
                      : "bg-gray-100 text-gray-900 rounded-bl-md"
                  }`}
                >
                  <p className="text-xs lg:text-sm leading-relaxed break-words">
                    {message.content}
                  </p>
                </div>

                <span
                  className={`text-xs text-gray-500 mt-1 ${
                    message.isOwn ? "text-right" : "text-left"
                  }`}
                >
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))}
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
