import React from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";

const mockNotifications = [
  {
    id: 1,
    type: "like",
    message: "Coffee Master님이 게시글을 좋아합니다.",
    user: {
      name: "Coffee Master",
      avatar:
        "https://cdn.builder.io/api/v1/image/assets%2F96669fc18d0a42e7921a546a167f4728%2F225690d8977549608e6ed4823c342234?format=webp&width=800",
      initials: "C",
    },
    time: "2분 전",
  },
  {
    id: 2,
    type: "comment",
    message: "Growth Hacker님이 댓글을 남겼습니다.",
    user: {
      name: "Growth Hacker",
      avatar:
        "https://cdn.builder.io/api/v1/image/assets%2F96669fc18d0a42e7921a546a167f4728%2Fa4664d4a45254082babb84389ef91331?format=webp&width=800",
      initials: "G",
    },
    time: "10분 전",
  },
  {
    id: 3,
    type: "follow",
    message: "Barista Pro님이 회원님을 팔로우하기 시작했습니다.",
    user: {
      name: "Barista Pro",
      avatar:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/a379c1873d3190768039f837ab75ed73623f0585?width=112",
      initials: "B",
    },
    time: "1시간 전",
  },
  {
    id: 4,
    type: "like",
    message: "Bean Lover님이 게시글을 좋아합니다.",
    user: {
      name: "Bean Lover",
      avatar:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/0acf6a3cab0a026c6c2d09cd335478a831d7d91a?width=112",
      initials: "B",
    },
    time: "어제",
  },
];

function NotificationItem({ notification }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
      <Avatar className="w-10 h-10">
        <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
        <AvatarFallback>{notification.user.initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 truncate">{notification.message}</div>
        <div className="text-xs text-gray-400">{notification.time}</div>
      </div>
      <Button size="icon" variant="ghost" className="ml-auto">
        <ChevronDown className="w-4 h-4" />
      </Button>
    </div>
  );
}

export default function Notifications() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeItem="notifications" />
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 lg:py-5">
          <h1 className="text-lg lg:text-xl font-semibold text-gray-900">알림</h1>
        </div>
        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {mockNotifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      </div>
    </div>
  );
}

