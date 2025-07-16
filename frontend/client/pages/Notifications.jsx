import React from "react"
import Sidebar from "@/components/Sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ChevronDown } from "lucide-react"

const mockNotifications = [
  {
    id: "1",
    type: "new_post",
    title: "MinJung Kim님이 새 글을 작성했습니다",
    description: "스페셜티 원두 10종 비교 후기 (with 추출 가이드)",
    timestamp: "2분 전",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/d070bb3f3d147d90540e7d98e4dd02c871952923?width=96",
    isUnread: true,
    isRecent: true
  },
  {
    id: "2",
    type: "like",
    title: "David Park님이 회원님의 글을 좋아합니다",
    description: "요리 초보자를 위한 간단한 레시피",
    timestamp: "15분 전",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/b7bac45d3313102eef0f1a77d59ea5cd945ae9e8?width=96",
    isUnread: true,
    isRecent: true
  },
  {
    id: "3",
    type: "comment",
    title: "Sarah Lee님이 회원님의 글에 댓글을 남겼습니다",
    description: "스타트업에서 배운 5가지 교훈",
    timestamp: "1시간 전",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/4b27584f3f63ece251fd4c0fea755536d0c4037a?width=96",
    isUnread: true,
    isRecent: true
  },
  {
    id: "4",
    type: "membership",
    title: "Alex Chen님이 회원님의 멤버십에 가입했습니다",
    description: "프리미엄 커피 가이드",
    timestamp: "3시간 전",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/1137ba6772ac4b05b3fc5f235bf9668b48a0cf34?width=96",
    isUnread: false,
    isRecent: false
  },
  {
    id: "5",
    type: "payment",
    title: "멤버십 결제가 완료되었습니다",
    description: "개발자 성장 멤버십",
    timestamp: "1일 전",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/0fb4d13a2b9293963739e5c22abcb278839c8c16?width=96",
    isUnread: false,
    isRecent: false
  },
  {
    id: "6",
    type: "cancellation",
    title: "멤버십 구독이 취소되었습니다",
    description: "요리 마스터 클래스",
    timestamp: "2일 전",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/7007f2218a5976e7d6e7005944a3be837de9f4ef?width=96",
    isUnread: false,
    isRecent: false
  }
]

export default function Notifications() {
  const recentNotifications = mockNotifications.filter(n => n.isRecent)
  const pastNotifications = mockNotifications.filter(n => !n.isRecent)

  const handleMarkAllAsRead = () => {
    // In a real app, this would make an API call
    console.log("Marking all notifications as read")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeItem="notifications" />

      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 lg:py-5">
          <div className="flex items-center justify-between">
            <h1 className="text-lg lg:text-xl font-semibold text-gray-900">
              알림
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-gray-500 hover:text-gray-700 text-xs lg:text-sm"
            >
              모두 읽음 처리
            </Button>
          </div>
        </div>

        {/* Notifications */}
        <div className="flex-1 overflow-y-auto">
          {/* Recent Notifications */}
          {recentNotifications.length > 0 && (
            <div className="px-4 lg:px-6 py-4 lg:py-6">
              <h2 className="text-lg lg:text-xl font-semibold text-black mb-4 lg:mb-6">
                최근
              </h2>
              <div className="space-y-1">
                {recentNotifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Past Notifications */}
          {pastNotifications.length > 0 && (
            <div className="px-4 lg:px-6 py-4 lg:py-6">
              <h2 className="text-lg lg:text-xl font-semibold text-black mb-4 lg:mb-6">
                지난 알림
              </h2>
              <div className="space-y-1">
                {pastNotifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Load More Button */}
          <div className="flex justify-center py-8">
            <Button
              variant="ghost"
              size="lg"
              className="rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 h-12 w-12 p-0"
            >
              <ChevronDown className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function NotificationItem({ notification }) {
  const getBorderStyle = () => {
    if (notification.isUnread) {
      return "border-l-4 border-l-brand-primary border-t border-r border-b border-brand-primary"
    }
    return "border border-gray-200"
  }

  return (
    <div
      className={`rounded-lg bg-white p-4 lg:p-6 cursor-pointer hover:shadow-sm transition-shadow ${getBorderStyle()}`}
    >
      <div className="flex items-start gap-3 lg:gap-4">
        <Avatar className="h-10 w-10 lg:h-12 lg:w-12 flex-shrink-0">
          <AvatarImage src={notification.avatar} alt="User" />
          <AvatarFallback className="bg-gray-200 text-gray-600 font-medium text-xs lg:text-sm">
            {notification.title.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-1 lg:mb-2 text-sm lg:text-base leading-tight">
                {notification.title}
              </h3>
              <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                {notification.description}
              </p>
            </div>
            <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
              <span className="text-xs lg:text-sm text-gray-500 whitespace-nowrap">
                {notification.timestamp}
              </span>
              {notification.isUnread && (
                <div className="h-2 w-2 bg-brand-primary rounded-full"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
