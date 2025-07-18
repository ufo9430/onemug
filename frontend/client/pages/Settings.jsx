import React, { useState, useEffect } from "react"
import Sidebar from "../components/Sidebar"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar"

// API 호출을 위한 함수들
const api = {
  // 사용자 구독 멤버십 목록 조회
  getMySubscriptions: async (userId) => {
    try {
      // 임시로 모든 멤버십 데이터를 가져오도록 수정 (테스트용)
      const response = await fetch(`http://localhost:8080/memberships`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Id': userId // 헤더에 사용자 ID 전달
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return [];
    }
  },

  // 활성 멤버십만 조회
  getActiveSubscriptions: async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/memberships/active-subscriptions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Id': userId
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch active subscriptions');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching active subscriptions:', error);
      return [];
    }
  },

  // 구독 이력 조회
  getSubscriptionHistory: async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/memberships/subscription-history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Id': userId
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscription history');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching subscription history:', error);
      return [];
    }
  },

  // 구독 취소
  cancelSubscription: async (subscriptionId, userId) => {
    try {
      const response = await fetch(`http://localhost:8080/memberships/${subscriptionId}/cancel`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'User-Id': userId
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }
      
      return await response.text();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile")
  const [nickname, setNickname] = useState("김민정")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  // 구독 관련 상태
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 임시 사용자 ID (실제로는 로그인 시스템에서 가져와야 함)
  const userId = 1; // 실제 구현에서는 로그인한 사용자 ID를 사용

  // 구독 데이터 로드
  useEffect(() => {
    if (activeTab === "subscriptions") {
      loadSubscriptions();
    }
  }, [activeTab]);

  const loadSubscriptions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await api.getMySubscriptions(userId);
      setSubscriptions(data);
    } catch (err) {
      setError('구독 정보를 불러오는데 실패했습니다.');
      console.error('Error loading subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = () => {
    console.log("Saving profile changes...")
  }

  const handleChangePassword = () => {
    console.log("Changing password...")
  }

  const handleCancelSubscription = async (subscriptionId) => {
    // 사용자 확인
    const confirmed = window.confirm('정말로 구독을 취소하시겠습니까?');
    if (!confirmed) return;
    
    try {
      const result = await api.cancelSubscription(subscriptionId, userId);
      console.log('구독 취소 성공:', result);
      
      // 성공 메시지 표시
      alert('구독이 성공적으로 취소되었습니다.');
      
      // 구독 목록 다시 로드
      await loadSubscriptions();
    } catch (error) {
      console.error('구독 취소 실패:', error);
      alert('구독 취소에 실패했습니다. 다시 시도해주세요.');
    }
  }

  const settingsTabs = [
    { id: "profile", label: "프로필" },
    { id: "account", label: "계정" },
    { id: "subscriptions", label: "구독 멤버십" },
    { id: "payment", label: "결제" }
  ]

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
                subscriptions={subscriptions}
                onCancel={handleCancelSubscription}
                loading={loading}
                error={error}
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

function SubscriptionsSettings({ subscriptions, onCancel, loading, error }) {
  if (loading) {
    return (
      <div className="max-w-2xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">구독 멤버십</h2>
          <p className="text-gray-600 mt-2">
            구독 중인 창작자와 멤버십 혜택을 관리하세요.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="text-center py-12">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">구독 멤버십</h2>
          <p className="text-gray-600 mt-2">
            구독 중인 창작자와 멤버십 혜택을 관리하세요.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

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
            {subscriptions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">구독 중인 멤버십이 없습니다.</p>
              </div>
            ) : (
              subscriptions.map(subscription => (
                <div
                  key={subscription.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={subscription.avatar || "https://cdn.builder.io/api/v1/image/assets/TEMP/5cf25178d404c9657f984e256dd1c49b5c5f4571?width=80"}
                      alt={subscription.creatorName}
                    />
                    <AvatarFallback className="bg-brand-primary text-white font-semibold">
                      {subscription.creatorName ? subscription.creatorName.charAt(0) : 'A'}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {subscription.creatorName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {subscription.name} • ₩{subscription.price?.toLocaleString()}/월
                    </p>
                    <p className="text-xs text-gray-500">
                      상태: {subscription.status === 'ACTIVE' ? '활성' : subscription.status === 'EXPIRED' ? '만료' : '취소됨'}
                      {subscription.autoRenew && ' • 자동 갱신'}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => onCancel(subscription.id)}
                      className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100"
                    >
                      취소
                    </button>
                    <p className="text-xs text-gray-500">
                      {subscription.expiresAt && new Date(subscription.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
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
