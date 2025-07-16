import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Users,
  Mail,
  Bell,
  Settings,
  Home,
  LayoutDashboard,
} from "lucide-react";

const CreatorSidebar = ({
  activeItem = "dashboard",
  className = "",
}) => {
  const navigate = useNavigate();

  const navigationItems = [
    {
      id: "dashboard",
      label: "대시보드",
      icon: LayoutDashboard,
      path: "/creator/dashboard",
    },
    {
      id: "insights",
      label: "인사이트",
      icon: BarChart3,
      path: "/creator/insights",
    },
    {
      id: "subscribers",
      label: "구독자",
      icon: Users,
      path: "/creator/subscribers",
    },
    {
      id: "communication",
      label: "소통",
      icon: Mail,
      path: "/creator/communication",
    },
    {
      id: "notifications",
      label: "알림",
      icon: Bell,
      path: "/creator/notifications",
    },
    {
      id: "settings",
      label: "설정",
      icon: Settings,
      path: "/creator/settings",
    },
    {
      id: "home",
      label: "홈으로",
      icon: Home,
      path: "/",
    },
  ];

  return (
    <aside className={`w-64 bg-white shadow-md h-full flex flex-col ${className}`}>
      <div className="flex-1 py-8 px-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors ${
                activeItem === item.id
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default CreatorSidebar;
