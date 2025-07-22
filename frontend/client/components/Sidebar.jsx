import { useState, useEffect } from "react";
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
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "@/lib/axios";

const Sidebar = ({ profile = {}, activeItem }) => {
  const navigate = useNavigate();
  const [hasUnread, setHasUnread] = useState(false);
  const [loading, setLoading] = useState(!profile?.nickname); // 간단한 로딩 조건

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await axios.get("/notice/api/unread");
        setHasUnread(res.data.checkUnread === true);
      } catch (err) {
        console.error("알림 상태를 불러오지 못했습니다:", err);
      }
    };

    if (profile?.nickname) setLoading(false); // profile 받아왔으면 로딩 종료
    fetchNotice();
  }, [profile]);

  const navigationItems = [
    { id: "feed", label: "피드", icon: Home, path: "/feed" },
    { id: "explore", label: "탐색", icon: Search, path: "/explore" },
    { id: "messages", label: "소통", icon: Mail, path: "/messages" },
    {
      id: "subscriptions",
      label: "구독한 창작자",
      icon: CheckSquare,
      path: "/subscriptions",
    },
    { id: "notifications", label: "알림", icon: Bell, path: "/notifications" },
    {
      id: "bookmarks",
      label: "좋아요한 글",
      icon: Bookmark,
      path: "/bookmarks",
    },
    { id: "recent", label: "최근 본 글", icon: Clock, path: "/recent" },
    { id: "settings", label: "설정", icon: Settings, path: "/settings" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col min-h-screen w-full lg:w-80 bg-white border-r border-gray-200">
      <div className="flex flex-col flex-grow">
        {/* Header */}
        <div className="h-[45px] border-b border-gray-200 flex items-center px-[26px]">
          <h1 className="text-xl font-bold text-gray-900">OneMug</h1>
        </div>

        {/* User Profile */}
        <div className="p-4">
          {loading ? (
            <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-36 h-3" />
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={
                    profile?.profileUrl
                      ? `http://localhost:8080${profile.profileUrl}`
                      : "/default-profile.png"
                  }
                  alt="프로필 이미지"
                />
                <AvatarFallback className="bg-brand-primary text-white font-semibold text-sm">
                  {profile.nickname?.charAt(0) || "닉"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-gray-900">
                  {profile.nickname}
                </div>
                <div className="text-sm text-gray-500">{profile.email}</div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
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
                    <Icon
                      className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-600"}`}
                    />
                    {isNotification && hasUnread && (
                      <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2.5 h-2.5" />
                    )}
                  </div>
                  <span
                    className={`font-medium ${isActive ? "text-white" : "text-gray-600"}`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Bottom Action */}
      <div className="p-4 border-t">
        {loading ? (
          <div className="w-full h-10 bg-gray-100 rounded animate-pulse" />
        ) : profile.isCreator ? (
          <button
            onClick={() => navigate("/creator/dashboard")}
            className="w-full bg-brand-primary text-white rounded-lg py-3 px-6 font-medium hover:bg-brand-primary/90 transition-colors text-sm"
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
