import {React, useEffect, useState} from "react"
import { useNavigate } from "react-router-dom"
import {
  BarChart3,
  Users,
  Mail,
  Bell,
  Settings,
  LayoutDashboard
} from "lucide-react"
import axios from "@/lib/axios";

const CreatorSidebar = ({ profile = {}, activeItem }) => {
  const navigate = useNavigate()
  const [hasUnread, setHasUnread] = useState(false)
  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await axios.get("/notice/api/unread");

        setHasUnread(res.data.checkUnread === true);
      } catch (err) {
        console.error("알림 상태를 불러오지 못했습니다:", err);
      }
    };

    fetchNotice();
  }, []);

  const navigationItems = [
    {
      id: "dashboard",
      label: "대시보드",
      icon: LayoutDashboard,
      path: "/creator/dashboard"
    },
    {
      id: "insights",
      label: "인사이트",
      icon: BarChart3,
      path: "/creator/insights"
    },
    {
      id: "subscribers",
      label: "구독자",
      icon: Users,
      path: "/creator/subscribers"
    },
    {
      id: "messages",
      label: "소통",
      icon: Mail,
      path: "/creator/messages"
    },
    {
      id: "notifications",
      label: "알림",
      icon: Bell,
      path: "/creator/notifications"
    },
    {
      id: "settings",
      label: "설정",
      icon: Settings,
      path: "/creator/settings"
    }
  ]

  const handleNavigation = path => {
    navigate(path)
  }

  return (
    <div className="flex flex-col min-h-screen w-full lg:w-80 bg-white border-r border-gray-200">
   {/* Header */}
      <div className="h-[45px] border-b border-gray-200 flex items-center px-[26px]">
        <h1 className="text-xl font-bold text-gray-900">OneMug</h1>
      </div>
<div className="flex flex-col flex-grow">

      {/* User Profile */}
      <div className="p-4">
        <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
          <img
            src={profile.profileUrl || "/default-profile.png"}
            alt={profile.nickname || "프로필 이미지"}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <div className="font-semibold text-gray-900">{profile.nickname}</div>
            <div className="text-sm text-gray-500">{profile.email}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <div className="space-y-1">
          {navigationItems.map(item => {
            const IconComponent = item.icon
            const isActive = activeItem === item.id
            const isNotification = item.id === "notifications"

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`w-full rounded-lg p-3 flex items-center gap-3 transition-colors ${
                  isActive
                    ? "bg-brand-primary text-white"
                    : "hover:bg-gray-50 text-gray-600"
                }`}
              >
                <div className="relative">

                  <IconComponent
                    className={`w-5 h-5 ${
                      isActive ? "text-white" : "text-gray-600"
                    }`}
                  />
                  {isNotification && hasUnread && (
                        <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2.5 h-2.5" />
                      )}
                </div>
                  <span className={`font-medium ${ isActive ? "text-white" : "text-gray-600" }`}>
                    {item.label}
                  </span>
              </button>
            )
          })}
        </div>
      </nav>
  </div>

      {/* Bottom Action - Switch to General Account */}
      <div className="p-4 border-t">
        <button
          onClick={() => navigate("/feed")}
          className="w-full bg-brand-primary text-white rounded-lg py-3 px-6 font-medium hover:bg-brand-primary/90 transition-colors text-sm"
        >
          일반 계정으로 전환
        </button>
      </div>
    </div>
  )
}

export default CreatorSidebar
