// src/pages/OAuthCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      alert("토큰이 전달되지 않았습니다.");
      navigate("/login");
      return;
    }

    // 로컬스토리지 또는 세션스토리지에 저장
    localStorage.setItem("token", token);

    // 사용자 정보 요청
    alert("로그인 성공");

    navigate("/feed");
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-gray-500 text-lg">로그인 처리 중입니다...</p>
    </div>
  );
}
