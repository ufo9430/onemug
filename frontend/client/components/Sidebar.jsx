import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Mail,
  Bell,
  Bookmark,
  Clock,
  Settings,
  Home,
  CheckSquare,
} from "lucide-react";

const Sidebar = ({
  hasCreatorAccount = false,
  activeItem = "feed",
  className = "",
}) => {
  const navigate = useNavigate();

  const navigationItems = [
    {
      id: "feed",
      label: "피드",
      icon: Home,
      path: "/feed",
    },
    {
      id: "search",
      label: "검색",
      icon: Search,
      path: "/search",
    },
    {
      id: "messages",
      label: "소통",
      icon: Mail,
      path: "/messages",
    },
    {
      id: "subscriptions",
      label: "구독한 창작자",
      icon: CheckSquare,
      path: "/subscriptions",
    },
    {
      id: "notifications",
      label: "알림",
      icon: Bell,
      path: "/notifications",
    },
    {
      id: "bookmarks",
      label: "북마크",
      icon: Bookmark,
      path: "/bookmarks",
    },
    {
      id: "recent",
      label: "최근 본 글",
      icon: Clock,
      path: "/recent",
    },
    {
      id: "settings",
      label: "설정",
      icon: Settings,
      path: "/settings",
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
      {hasCreatorAccount && (
        <div className="p-4 border-t">
          <button
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => navigate("/creator/dashboard")}
          >
            크리에이터 대시보드
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
