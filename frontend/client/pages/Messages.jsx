import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "@/components/Sidebar"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const mockConversations = [
  {
    id: "coffee-master",
    name: "Coffee Master",
    lastMessage: "안녕하세요! 원두 추천 부탁드려요",
    timestamp: "2분 전",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets%2F96669fc18d0a42e7921a546a167f4728%2F225690d8977549608e6ed4823c342234?format=webp&width=800"
  },
  {
    id: "growth-hacker",
    name: "Growth Hacker",
    lastMessage: "멤버십 이벤트 관련해서 문의가 있어요",
    timestamp: "15분 전",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets%2F96669fc18d0a42e7921a546a167f4728%2Fa4664d4a45254082babb84389ef91331?format=webp&width=800"
  },
  {
    id: "kim-min-jung",
    name: "김민정",
    lastMessage: "네, 감사합니다!",
    timestamp: "1시간 전",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets%2F96669fc18d0a42e7921a546a167f4728%2Fbb366f75478e4386bba89cfb978a8993?format=webp&width=800",
    isOnline: true
  },
  {
    id: "barista-pro",
    name: "Barista Pro",
    lastMessage: "라떼아트 강의 언제 시작하나요?",
    timestamp: "3시간 전",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/a379c1873d3190768039f837ab75ed73623f0585?width=112",
    unreadCount: 1
  },
  {
    id: "bean-lover",
    name: "Bean Lover",
    lastMessage: "원두 배송 확인 부탁드려요",
    timestamp: "어제",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/0acf6a3cab0a026c6c2d09cd335478a831d7d91a?width=112"
  },
  {
    id: "cafe-owner",
    name: "Cafe Owner",
    lastMessage: "비즈니스 제휴 관련 논의하고 싶습니다",
    timestamp: "2일 전",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/883b179b10e3f42937f47a604e4878e2e38586f3?width=112",
    isOnline: true,
    unreadCount: 2
  },
  {
    id: "roaster-kim",
    name: "Roaster Kim",
    lastMessage: "새로운 원두 샘플 보내드릴게요",
    timestamp: "3일 전",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/10d6d64c327c4da74fb3354892454d4ac4d934d1?width=112"
  },
  {
    id: "home-barista",
    name: "Home Barista",
    lastMessage: "추출 방법 조언 감사했어요!",
    timestamp: "1주일 전",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/5d104cc5e7d4da989a3ff6ac17ebc3c667834c06?width=112",
    isOnline: true
  }
]

//여기서 fetch 사용
  useEffect(() => {
  fetch('http://Localhost:8080/community', {
    method: 'GET', // "GET"은 서버에서 데이터를 요청하는 뜻이에요.
  })
    .then(response => response.json()) // 서버로부터 응답이 오면 JSON으로 변환해요.
    .then(data => {mockConversations = data}) // 데이터를 받아서 화면에 출력해요.
    .catch(error => console.error('Error:', error)); // 문제가 생기면 오류를 출력해요.
  }, []);


export default function Messages() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = mockConversations.filter(
    conv =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleConversationClick = conversationId => {
    navigate(`/messages/${conversationId}`)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeItem="messages" />

      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg lg:text-xl font-semibold text-gray-900">
              메시지
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
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 lg:pl-10 bg-gray-50 border-gray-200 rounded-lg h-10 lg:h-12 text-sm lg:text-base"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map(conversation => (
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
                        src={conversation.avatar}
                        alt={conversation.name}
                      />
                      <AvatarFallback className="bg-gray-200 text-gray-600 font-medium text-sm lg:text-base">
                        {conversation.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 lg:h-4 lg:w-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate text-sm lg:text-base">
                        {conversation.name}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2 flex-shrink-0">
                        {conversation.timestamp}
                      </span>
                    </div>
                    <p className="text-xs lg:text-sm text-gray-600 truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>

                  {/* Unread badge */}
                  {conversation.unreadCount && (
                    <div className="h-4 w-4 lg:h-5 lg:w-5 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-white">
                        {conversation.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
