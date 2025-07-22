import React, { useState, useRef, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import axios from "@/lib/axios";
import { jwtDecode } from "jwt-decode";

// JWT 토큰 가져오는 함수
const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// 사용자 ID 추출 함수
const getUserIdFromStorage = () => {
  // 저장소에서 직접 userId 확인
  let userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
  
  if (userId && userId !== 'undefined') {
    console.log('저장소에서 userId 발견:', userId);
    return userId;
  }
  
  // JWT 토큰에서 추출 시도
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) {
    console.warn('토큰이 없어 사용자 ID를 추출할 수 없습니다.');
    return null;
  }
  
  try {
    const decoded = jwtDecode(token);
    console.log('JWT 디코딩 성공:', decoded);
    
    // 다양한 필드에서 사용자 ID 추출 시도
    userId = decoded.userId || decoded.sub || decoded.id || decoded.user_id;
    
    if (userId) {
      console.log('JWT에서 userId 추출 성공:', userId);
      
      // 추출한 userId를 저장소에 저장
      if (localStorage.getItem('token')) {
        localStorage.setItem('userId', userId);
      } else {
        sessionStorage.setItem('userId', userId);
      }
      
      return userId;
    } else {
      console.warn('JWT에서 사용자 ID 필드를 찾을 수 없습니다:', decoded);
      return null;
    }
  } catch (error) {
    console.error('JWT 디코딩 실패:', error);
    return null;
  }
};

// API 호출을 위한 함수들
const api = {
  // 사용자 구독 멤버십 목록 조회
  getMySubscriptions: async () => {
    try {
      // 사용자 ID 가져오기
      const userId = getUserIdFromStorage();
      
      if (!userId) {
        console.warn('사용자 ID가 없어 구독 목록을 조회할 수 없습니다.');
        return [];
      }
      
      console.log('구독 목록 조회 요청. 사용자 ID:', userId);
      
      // 변경된 API 엔드포인트로 요청 (userId를 쿼리 파라미터로 전달)
      const response = await axios.get("/memberships/my-subscriptions", {
        headers: {
          ...getAuthHeaders(),
          'User-Id': userId
        },
        params: { userId } // 쿼리 파라미터로 userId 전달
      });

      console.log('구독 목록 조회 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      console.error('오류 세부 정보:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data
      });
      return [];
    }
  },

  // 활성 멤버십만 조회
  getActiveSubscriptions: async () => {
    try {
      const userId = getUserIdFromStorage();
      
      if (!userId) {
        console.warn('사용자 ID가 없어 활성 구독 목록을 조회할 수 없습니다.');
        return [];
      }
      
      const response = await axios.get("/memberships/active-subscriptions", {
        headers: {
          ...getAuthHeaders(),
          'User-Id': userId
        },
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching active subscriptions:", error);
      return [];
    }
  },

  // 구독 이력 조회
  getSubscriptionHistory: async () => {
    try {
      const userId = getUserIdFromStorage();
      
      if (!userId) {
        console.warn('사용자 ID가 없어 구독 이력을 조회할 수 없습니다.');
        return [];
      }
      
      const response = await axios.get("/memberships/subscription-history", {
        headers: {
          ...getAuthHeaders(),
          'User-Id': userId
        },
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching subscription history:", error);
      return [];
    }
  },

  // 구독 취소
  cancelSubscription: async (subscriptionId) => {
    try {
      const userId = getUserIdFromStorage();
      
      if (!userId) {
        console.warn('사용자 ID가 없어 구독을 취소할 수 없습니다.');
        throw new Error('사용자 ID가 없습니다.');
      }
      
      const response = await axios.delete(`/memberships/${subscriptionId}/cancel`, {
        headers: {
          ...getAuthHeaders(),
          'User-Id': userId
        },
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      throw error;
    }
  }
};

export default function Settings() {
  const [userInfo, setUserInfo] = useState({});
  const [activeTab, setActiveTab] = useState("profile");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 구독 관련 상태
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 임시 사용자 ID (실제로는 로그인 시스템에서 가져와야 함)
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  const userId = getUserIdFromStorage();

  const settingsTabs = [
    { id: "profile", label: "프로필" },
    { id: "account", label: "계정" },
    { id: "subscriptions", label: "구독 멤버십" },
    { id: "payment", label: "결제" },
  ];

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = await axios.get("/api/user/me", {
          headers: getAuthHeaders()
        });
        setUserInfo(res.data);
      } catch (error) {
        alert("사용자 정보 요청을 실패했습니다. 다시 로그인해주세요");
        setUser(null);
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("/welcome");
      }
    };

    getUserInfo();
  }, []);

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
      const data = await api.getMySubscriptions();
      setSubscriptions(data);
    } catch (err) {
      setError("구독 정보를 불러오는데 실패했습니다.");
      console.error("Error loading subscriptions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async ({
    nickname,
    selectedFile,
    rawProfileUrl,
    setRawProfileUrl,
    setProfileImageUrl,
  }) => {
    let uploadedPath = rawProfileUrl;

    try {
      // 1. 이미지 업로드
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadRes = await axios.post("/profile-image", formData, {
          headers: getAuthHeaders()
        });
        uploadedPath = uploadRes.data.profileUrl;
        setRawProfileUrl(uploadedPath);
        setProfileImageUrl(`http://localhost:8080${uploadedPath}`);
      }

      // 2. 닉네임, 이미지 경로 업데이트
      const res = await axios.put(`/api/user/${userInfo.id}`, {
        nickname,
        profileUrl: uploadedPath,
      }, {
        headers: getAuthHeaders()
      });

      setUserInfo(res.data);
      alert("프로필 저장 완료");
      location.reload();
    } catch (err) {
      console.error("저장 중 오류 발생:", err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("모든 비밀번호 입력란을 채워주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const res = await axios.put(`/api/user/${userInfo.id}`, {
        currentPassword,
        password: newPassword,
      }, {
        headers: getAuthHeaders()
      });

      alert("비밀번호가 성공적으로 변경되었습니다.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (err.response?.data) {
        alert("비밀번호 변경 실패: " + err.response.data.message);
      } else {
        alert("비밀번호 변경 중 오류 발생");
      }
      console.error(err);
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    // 사용자 확인
    const confirmed = window.confirm("정말로 구독을 취소하시겠습니까?");
    if (!confirmed) return;

    try {
      const result = await api.cancelSubscription(subscriptionId);
      console.log("구독 취소 성공:", result);

      // 성공 메시지 표시
      alert("구독이 성공적으로 취소되었습니다.");

      // 구독 목록 다시 로드
      await loadSubscriptions();
    } catch (error) {
      console.error("구독 취소 실패:", error);
      alert("구독 취소에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
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
              {settingsTabs.map((tab) => (
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
                userInfo={userInfo}
                setUserInfo={setUserInfo}
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
  );
}

function ProfileSettings({ userInfo, onSave }) {
  const fileInputRef = useRef();

  const [nickname, setNickname] = useState("");

  const [selectedFile, setSelectedFile] = useState(null); // 사진 파일 저장
  const [previewUrl, setPreviewUrl] = useState(null); // 미리보기용
  const [profileImageUrl, setProfileImageUrl] = useState(""); // 이미지 주소 + 경로
  const [rawProfileUrl, setRawProfileUrl] = useState(""); // 이미지 경로

  useEffect(() => {
    if (userInfo) {
      setNickname(userInfo.nickname || "");
      setRawProfileUrl(userInfo.profileUrl || "");
      setProfileImageUrl(`http://localhost:8080${userInfo.profileUrl}`);
    }
  }, [userInfo]);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleClickSave = () => {
    onSave({
      nickname,
      selectedFile,
      rawProfileUrl,
      setRawProfileUrl,
      setProfileImageUrl,
    });
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        {/* User Info Section */}
        <div className="flex items-center gap-6 mb-8">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={previewUrl || profileImageUrl || undefined}
              alt="Profile"
            />
            <AvatarFallback className="bg-brand-primary text-white font-semibold text-xl">
              {userInfo.nickname?.charAt(0) || "닉"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">
              {userInfo?.nickname}
            </h2>
            <p className="text-gray-500">{userInfo?.email}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-sm"
            onClick={handleUploadClick}
          >
            사진 변경
          </Button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
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
              onChange={(e) => setNickname(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="border-t border-gray-100 pt-6 flex justify-end">
            <Button
              onClick={handleClickSave}
              className="bg-brand-primary hover:bg-brand-primary/90"
            >
              변경사항 저장
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountSettings({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  onChangePassword,
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onChangePassword();
            }}
            className="space-y-4"
          >
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
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
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
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-11"
              />
            </div>
          </form>

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
  );
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
              subscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={
                        subscription.avatar ||
                        "https://cdn.builder.io/api/v1/image/assets/TEMP/5cf25178d404c9657f984e256dd1c49b5c5f4571?width=80"
                      }
                      alt={subscription.creatorName}
                    />
                    <AvatarFallback className="bg-brand-primary text-white font-semibold">
                      {subscription.creatorName
                        ? subscription.creatorName.charAt(0)
                        : "A"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {subscription.creatorName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {subscription.name} • ₩
                      {subscription.price?.toLocaleString()}/월
                    </p>
                    <p className="text-xs text-gray-500">
                      상태:{" "}
                      {subscription.status === "ACTIVE"
                        ? "활성"
                        : subscription.status === "EXPIRED"
                          ? "만료"
                          : "취소됨"}
                      {subscription.autoRenew && " • 자동 갱신"}
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
                      {subscription.expiresAt &&
                        new Date(subscription.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
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
  );
}
