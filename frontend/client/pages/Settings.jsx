import React, { useState } from "react"
import Sidebar from "../components/Sidebar"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar"

const mockSubscriptions = [
  {
    id: "1",
    name: "아티스트 A",
    tier: "티어 2 멤버십",
    price: "₩15,000/월",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/5cf25178d404c9657f984e256dd1c49b5c5f4571?width=80"
  },
  {
    id: "2",
    name: "아티스트 A",
    tier: "티어 2 멤버십",
    price: "₩15,000/월",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/5cf25178d404c9657f984e256dd1c49b5c5f4571?width=80"
  },
  {
    id: "3",
    name: "아티스트 A",
    tier: "티어 2 멤버십",
    price: "₩15,000/월",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/5cf25178d404c9657f984e256dd1c49b5c5f4571?width=80"
  },
  {
    id: "4",
    name: "아티스트 A",
    tier: "티어 2 멤버십",
    price: "₩15,000/월",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/5cf25178d404c9657f984e256dd1c49b5c5f4571?width=80"
  }
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile")
  const [nickname, setNickname] = useState("김민정")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const settingsTabs = [
    { id: "profile", label: "프로필" },
    { id: "account", label: "계정" },
    { id: "subscriptions", label: "구독 멤버십" },
    { id: "payment", label: "결제" }
  ]

  const handleSaveProfile = () => {
    console.log("Saving profile changes...")
  }

  const handleChangePassword = () => {
    console.log("Changing password...")
  }

  const handleCancelSubscription = subscriptionId => {
    console.log("Canceling subscription:", subscriptionId)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeItem="settings" />

      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 lg:py-5">
          <h1 className="text-lg lg:text-xl font-semibold text-gray-900">
            설정
          </h1>
        </div>

        <div className="flex flex-1">
          {/* Settings Navigation */}
          <div className="w-full lg:w-80 bg-white border-r border-gray-200 p-4 lg:p-6">
            <div className="space-y-1">
              {settingsTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1 p-4 lg:p-6">
            {activeTab === "profile" && (
              <ProfileSettings
                nickname={nickname}
                setNickname={setNickname}
                onSave={handleSaveProfile}
              />
            )}
            {activeTab === "account" && (
              <AccountSettings
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                onChangePassword={handleChangePassword}
              />
            )}
            {activeTab === "subscriptions" && (
              <SubscriptionsSettings
                subscriptions={mockSubscriptions}
                onCancel={handleCancelSubscription}
              />
            )}
            {activeTab === "payment" && <PaymentSettings />}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileSettings({ nickname, setNickname, onSave }) {
  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        {/* User Info Section */}
        <div className="flex items-center gap-6 mb-8">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/3bdb10a00a15d75beb0b255a9726d74150519a41?width=160"
              alt="Profile"
            />
            <AvatarFallback className="bg-brand-primary text-white font-semibold text-xl">
              김
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">김민정</h2>
            <p className="text-gray-500">@minjung_kim</p>
          </div>
          <Button variant="outline" size="sm" className="text-sm">
            사진 변경
          </Button>
        </div>

        {/* Nickname Section */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="nickname"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              닉네임
            </label>
            <Input
              id="nickname"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="border-t border-gray-100 pt-6 flex justify-end">
            <Button
              onClick={onSave}
              className="bg-brand-primary hover:bg-brand-primary/90"
            >
              변경사항 저장
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function AccountSettings({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  onChangePassword
}) {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">계정</h2>
        <p className="text-gray-600 mt-2">
          계정 정보와 로그인 설정을 관리하세요.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              비밀번호 변경
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              계정 보안을 위해 정기적으로 비밀번호를 변경하세요.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="current-password"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                현재 비밀번호
              </label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="h-11"
              />
            </div>

            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                새 비밀번호
              </label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="h-11"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                새 비밀번호 확인
              </label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="h-11"
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 flex justify-end">
            <Button
              onClick={onChangePassword}
              className="bg-brand-primary hover:bg-brand-primary/90"
            >
              비밀번호 변경
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SubscriptionsSettings({ subscriptions, onCancel }) {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">구독 멤버십</h2>
        <p className="text-gray-600 mt-2">
          구독 중인 창작자와 멤버십 혜택을 관리하세요.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              현재 구독
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              구독 중인 창작자들의 멤버십 현황입니다.
            </p>
          </div>

          <div className="space-y-4">
            {subscriptions.map(subscription => (
              <div
                key={subscription.id}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={subscription.avatar}
                    alt={subscription.name}
                  />
                  <AvatarFallback className="bg-brand-primary text-white font-semibold">
                    A
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {subscription.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {subscription.tier} • {subscription.price}
                  </p>
                </div>

                <button
                  onClick={() => onCancel(subscription.id)}
                  className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded"
                >
                  취소
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Payment Settings Component
function PaymentSettings() {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">결제</h2>
        <p className="text-gray-600 mt-2">결제 방법과 청구서를 관리하세요.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">결제 설정 기능이 곧 추가됩니다.</p>
        </div>
      </div>
    </div>
  )
}
