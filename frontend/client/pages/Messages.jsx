import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const mockConversations = [
  {
    id: "coffee-master",
    name: "Coffee Master",
    lastMessage: "안녕하세요! 원두 추천 부탁드려요",
    timestamp: "2분 전",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets%2F96669fc18d0a42e7921a546a167f4728%2F225690d8977549608e6ed4823c342234?format=webp&width=800",
    isOnline: true,
    unreadCount: 3,
  },
  {
    id: "growth-hacker",
    name: "Growth Hacker",
    lastMessage: "멤버십 이벤트 관련해서 문의가 있어요",
    timestamp: "15분 전",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets%2F96669fc18d0a42e7921a546a167f4728%2Fa4664d4a45254082babb84389ef91331?format=webp&width=800",
  },
  {
    id: "kim-min-jung",
    name: "김민정",
    lastMessage: "네, 감사합니다!",
    timestamp: "1시간 전",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets%2F96669fc18d0a42e7921a546a167f4728%2Fbb366f75478e4386bba89cfb978a8993?format=webp&width=800",
    isOnline: true,
  },
  {
    id: "barista-pro",
    name: "Barista Pro",
    lastMessage: "라루아트 강의 언제 시작하나요?",
    timestamp: "3시간 전",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/a379c1873d3190768039f837ab75ed73623f0585?width=112",
    unreadCount: 1,
  },
  {
    id: "bean-lover",
    name: "Bean Lover",
    lastMessage: "원두 배송 확인 부탁드려요",
    timestamp: "어제",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/0acf6a3cab0a026c6c2d09cd335478a831d7d91a?width=112",
  },
  {
    id: "cafe-owner",
    name: "Cafe Owner",
    lastMessage: "비즈니스 제휴 관련 논의하고 싶습니다",
    timestamp: "2일 전",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/883b179b10e3f42937f47a604e4878e2e38586f3?width=112",
    isOnline: true,
    unreadCount: 2,
  },
  {
    id: "roaster-kim",
    name: "Roaster Kim",
    lastMessage: "새로운 원두 샘플 보내드릴게요",
    timestamp: "3일 전",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/7e7b1e2c5f8c2f7d0e6f4f6d7f3e2b8b6e2d2e8b6?width=112",
  },
];

function ConversationItem({ conversation }) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer ${conversation.isActive ? "bg-gray-100" : ""}`}>
      <Avatar className="w-12 h-12">
        <AvatarImage src={conversation.avatar} alt={conversation.name} />
        <AvatarFallback>{conversation.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 truncate">{conversation.name}</span>
          {conversation.isOnline && <span className="ml-2 w-2 h-2 rounded-full bg-green-500 inline-block" />}
        </div>
        <div className="text-sm text-gray-500 truncate">{conversation.lastMessage}</div>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-xs text-gray-400 mb-1">{conversation.timestamp}</span>
        {conversation.unreadCount ? (
          <span className="bg-brand-primary text-white text-xs px-2 py-0.5 rounded-full">
            {conversation.unreadCount}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default function Messages() {
  const [search, setSearch] = useState("");
  const filteredConversations = mockConversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeItem="messages" />
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 lg:py-5 flex items-center gap-4">
          <h1 className="text-lg lg:text-xl font-semibold text-gray-900 flex-1">메시지</h1>
          <Button size="icon" variant="outline">
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        {/* Search Input */}
        <div className="bg-white px-4 py-2 border-b border-gray-200">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="대화 상대 검색..."
            className="w-full max-w-md"
          />
        </div>
        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredConversations.map((conv) => (
            <ConversationItem key={conv.id} conversation={conv} />
          ))}
        </div>
      </div>
    </div>
  );
}

