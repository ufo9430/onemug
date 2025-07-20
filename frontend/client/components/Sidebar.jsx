import { React, useState, useEffect } from "react";
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
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/notice/api/unread", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.checkUnread === true) {
          setHasUnread(true);
        } else {
          setHasUnread(false);
        }
      })
      .catch((err) => {
        console.error("알림 상태를 불러오지 못했습니다:", err);
      });
  }, []);

  const navigationItems = [
    {
      id: "feed",
      label: "피드",
      icon: Home,
      path: "/feed",
    },
    {
      id: "search",
      label: "탐색",
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
      label: "좋아요한 글",
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

  const handleNavigation = (path) => {
    navigate(path);
  };

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
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/74a447f181f8719eda86719d9315b0e741b1307f?width=96"
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
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeItem === item.id;
            const isNotification = item.id === "notifications";

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
                  {/* 읽지 않은 알림 표시 */}
                  {isNotification && hasUnread && (
                    <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2.5 h-2.5"></span>
                  )}
                </div>
                <span
                  className={`font-medium ${
                    isActive ? "text-white" : "text-gray-600"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom Action */}
      <div className="p-4">
        {hasCreatorAccount ? (
          <button
            onClick={() => navigate("/creator/dashboard")}
            className="w-full bg-brand-primary text-white rounded-lg py-3 px-6 font-medium hover:bg-brand-primary/90 transition-colors"
          >
            창작 계정으로 전환
          </button>
        ) : (
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-2">
              또는
              <br />
              창작자가 되어 보세요
            </div>
            <button
              onClick={() => navigate("/creator/signup")}
              className="w-full bg-brand-primary text-white rounded-lg py-3 px-6 font-medium hover:bg-brand-primary/90 transition-colors"
            >
              창작자 계정 생성
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
