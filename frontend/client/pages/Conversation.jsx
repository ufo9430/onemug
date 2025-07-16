import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Phone, ChevronDown, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const mockUsers = {
  "coffee-master": {
    id: "coffee-master",
    name: "Coffee Master",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/103ad23fdec830cc6845a6b15a4ea1458ff7394e?width=128",
    isOnline: true,
  },
};

const mockMessages = {
  "coffee-master": [
    {
      id: "1",
      senderId: "coffee-master",
      content: "안녕하세요! 원두 추천 부탁드려요",
      timestamp: "오후 2:30",
      isOwn: false,
    },
    {
      id: "2",
      senderId: "current-user",
      content: "안녕하세요! 어떤 맛을 선호하시나요?",
      timestamp: "오후 2:32",
      isOwn: true,
    },
    {
      id: "3",
      senderId: "coffee-master",
      content: "산미가 있으면서도 부드러운 맛을 좋아해요",
      timestamp: "오후 2:33",
      isOwn: false,
    },
    {
      id: "4",
      senderId: "current-user",
      content:
        "그렇다면 에티오피아 예가체프를 추천드려요! 산미와 플로럴 향이 좋아요.",
      timestamp: "오후 2:34",
      isOwn: true,
    },
  ],
};

export default function Conversation() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");

  const user = conversationId ? mockUsers[conversationId] : null;
  const messages = conversationId ? mockMessages[conversationId] || [] : [];

  if (!user) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar activeItem="messages" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">대화를 찾을 수 없습니다</h1>
            <button
              className="px-4 py-2 bg-brand-primary text-white rounded-lg"
              onClick={() => navigate("/messages")}
            >
              메시지 목록으로 돌아가기
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeItem="messages" />
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-gray-900 flex items-center gap-2">
                {user.name}
                {user.isOnline && <span className="ml-2 text-xs text-green-500">● 온라인</span>}
              </div>
              <div className="text-xs text-gray-500">@{user.id}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ChevronDown className="w-5 h-5" />
            </Button>
          </div>
        </header>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg shadow-sm text-base ${
                  msg.isOwn
                    ? "bg-brand-primary text-white rounded-br-none"
                    : "bg-white text-gray-900 rounded-bl-none border"
                }`}
              >
                {msg.content}
                <div className="text-xs text-gray-400 mt-1 text-right">{msg.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Input */}
        <form
          className="bg-white border-t border-gray-200 px-6 py-4 flex items-center gap-4"
          onSubmit={e => {
            e.preventDefault();
            if (newMessage.trim()) {
              // 메시지 전송 로직 (모킹)
              setNewMessage("");
            }
          }}
        >
          <Input
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요"
            className="flex-1"
          />
          <Button type="submit" variant="solid" size="icon">
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </main>
    </div>
  );
}
