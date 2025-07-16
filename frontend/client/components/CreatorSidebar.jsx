import React from "react"
import { useNavigate } from "react-router-dom"
import {
  BarChart3,
  Users,
  Mail,
  Bell,
  Settings,
  LayoutDashboard
} from "lucide-react"

const CreatorSidebar = ({ activeItem = "dashboard", className = "" }) => {
  const navigate = useNavigate()

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
      id: "communication",
      label: "소통",
      icon: Mail,
      path: "/creator/communication"
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
    <div
      className={`w-full lg:w-80 h-screen bg-white border-r border-gray-200 flex flex-col fixed lg:relative z-10 lg:z-auto ${className}`}
    >
      {/* Header */}
      <div className="h-[89px] border-b border-gray-200 flex items-center px-[52px]">
        <h1 className="text-xl font-bold text-gray-900">OneMug</h1>
      </div>

      {/* User Profile */}
      <div className="p-4">
        <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/6539a7b51be212286986ed75ddba09863d0830dc?width=96"
            alt="User"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <div className="font-semibold text-gray-900">김민정</div>
            <div className="text-sm text-gray-500">minjung_kim@abc.abc</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <div className="space-y-1">
          {navigationItems.map(item => {
            const IconComponent = item.icon
            const isActive = activeItem === item.id

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
                <IconComponent
                  className={`w-5 h-5 ${
                    isActive ? "text-white" : "text-gray-600"
                  }`}
                />
                <span
                  className={`font-medium ${
                    isActive ? "text-white" : "text-gray-600"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Bottom Action - Switch to General Account */}
      <div className="p-4 space-y-4">
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
