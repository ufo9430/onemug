import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";

const TABS = [
  { key: "profile", label: "프로필" },
  { key: "account", label: "계정" },
  { key: "subscription", label: "구독" },
  { key: "payment", label: "결제" },
];

const mockSubscriptions = [
  {
    id: "1",
    name: "아티스트 A",
    tier: "티어 2 멤버십",
    price: "₩15,000/월",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/5cf25178d404c9657f984e256dd1c49b5c5f4571?width=80",
  },
  {
    id: "2",
    name: "아티스트 B",
    tier: "티어 1 멤버십",
    price: "₩10,000/월",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/5cf25178d404c9657f984e256dd1c49b5c5f4571?width=80",
  },
  {
    id: "3",
    name: "아티스트 A",
    tier: "티어 2 멤버십",
    price: "₩15,000/월",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/5cf25178d404c9657f984e256dd1c49b5c5f4571?width=80",
  },
  {
    id: "4",
    name: "아티스트 A",
    tier: "티어 2 멤버십",
    price: "₩15,000/월",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/5cf25178d404c9657f984e256dd1c49b5c5f4571?width=80",
  },
];

function Settings() {
  const [tab, setTab] = useState("profile");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeItem="settings" />
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 lg:py-5">
          <h1 className="text-lg lg:text-xl font-semibold text-gray-900">설정</h1>
        </div>
        {/* Tabs */}
        <div className="flex gap-2 px-4 py-2 bg-white border-b border-gray-200">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${tab === t.key ? "bg-brand-primary text-white" : "bg-gray-100 text-gray-700"}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {/* Content */}
        <div className="flex-1 bg-gray-50 p-4 lg:p-6">
          {tab === "profile" && (
            <div className="max-w-xl mx-auto space-y-6">
              {/* Profile Settings */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">프로필 정보</h2>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="https://cdn.builder.io/api/v1/image/assets/TEMP/d5ee4b9e89993eff120520ccacca32438749b014?width=1692" alt="프로필" />
                    <AvatarFallback>MK</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-900">MinJung Kim</div>
                    <div className="text-xs text-gray-500">홈카페 유저</div>
                  </div>
                </div>
                <Input defaultValue="MinJung Kim" className="mb-2" />
                <Input defaultValue="홈카페 유저" />
              </div>
            </div>
          )}
          {tab === "account" && (
            <div className="max-w-xl mx-auto space-y-6">
              {/* Account Settings */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">계정 정보</h2>
                <Input defaultValue="minjung@email.com" className="mb-2" />
                <Input defaultValue="비밀번호 변경" type="password" />
              </div>
            </div>
          )}
          {tab === "subscription" && (
            <div className="max-w-xl mx-auto space-y-6">
              {/* Subscription Settings */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">구독 멤버십</h2>
                {mockSubscriptions.length === 0 ? (
                  <div className="text-gray-500">현재 구독 중인 멤버십이 없습니다.</div>
                ) : (
                  <div className="space-y-4">
                    {mockSubscriptions.map((sub) => (
                      <div key={sub.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={sub.avatar} alt={sub.name} />
                          <AvatarFallback>{sub.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{sub.name}</div>
                          <div className="text-xs text-gray-500">{sub.tier}</div>
                        </div>
                        <div className="text-sm font-semibold text-gray-700">{sub.price}</div>
                        <Button variant="outline" size="sm" onClick={() => console.log('Cancel subscription:', sub.id)}>
                          구독 취소
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {tab === "payment" && (
            <div className="max-w-xl mx-auto space-y-6">
              {/* Payment Settings */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">결제 정보</h2>
                <div>등록된 결제 수단이 없습니다.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
