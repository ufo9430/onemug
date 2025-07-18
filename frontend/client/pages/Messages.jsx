import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

function formatRelativeTime(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);

  const diffSec = Math.floor((now - time) / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return `${diffSec}초 전`;
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  if (diffWeek < 5) return `${diffWeek}주 전`;
  if (diffMonth < 12) return `${diffMonth}개월 전`;
  return `${diffYear}년 전`;
}

export default function Messages() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleConversationClick = (conversationId) => {
    navigate(`/messages/${conversationId}`);
  };

  //여기서 fetch 사용

  useEffect(() => {
    fetch("http://localhost:8080/community", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("서버 응답 실패");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setConversations(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    // /community 응답 데이터
    // [
    //   {
    //     "chatroomId": 0,
    //     "recentChat": "string",
    //     "nickname": "string",
    //     "profileUrl": "string",
    //     "createdAt": "2025-07-18T02:41:50.799Z"
    //   }
    // ]
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeItem="messages" />

      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg lg:text-xl font-semibold text-gray-900">
              커뮤니티
            </h1>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 lg:h-10 lg:w-10 rounded-lg hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 lg:h-6 lg:w-6" />
            </Button>
          </div>

          {/* Search */}
          <div className="mt-4 lg:mt-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 lg:h-5 lg:w-5 text-gray-400" />
            <Input
              placeholder="메시지 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 lg:pl-10 bg-gray-50 border-gray-200 rounded-lg h-10 lg:h-12 text-sm lg:text-base"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => handleConversationClick(conversation.id)}
              className="bg-white border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="px-4 lg:px-6 py-3 lg:py-4">
                <div className="flex items-center gap-3 lg:gap-4">
                  {/* Avatar with online indicator */}
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-12 w-12 lg:h-14 lg:w-14">
                      <AvatarImage
                        src={conversation.profileUrl}
                        alt={conversation.nickname}
                      />
                      <AvatarFallback className="bg-gray-200 text-gray-600 font-medium text-sm lg:text-base">
                        {conversation.nickname.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate text-sm lg:text-base">
                        {conversation.nickname}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2 flex-shrink-0">
                        {conversation.timestamp}
                      </span>
                    </div>
                    <p className="text-xs lg:text-sm text-gray-600 truncate">
                      {conversation.recentChat}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
