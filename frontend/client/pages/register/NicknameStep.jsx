import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/lib/axios";

const ProgressDots = ({ currentStep, totalSteps }) => (
  <div className="flex justify-center gap-2 mb-8">
    {Array.from({ length: totalSteps }).map((_, index) => (
      <div
        key={index}
        className={`w-2 h-2 rounded-full ${
          index === currentStep ? "bg-brand-primary" : "bg-gray-300"
        }`}
      />
    ))}
  </div>
);

export default function NicknameStep() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nickname.trim() && isValidNickname(nickname)) {
      // Store nickname and complete registration
      localStorage.setItem("registration_nickname", nickname);

      // Get stored registration data
      const email = localStorage.getItem("registration_email");
      const password = localStorage.getItem("registration_password");

      // Here you would typically call your registration API
      console.log("Registration data:", { email, password, nickname });

      try {
        const res = await axios.post(
          "/auth/signup",
          {
            email,
            password,
            nickname,
          },
          { withCredentials: true },
        );

        // 가입 완료 후 localStorage 정리
        localStorage.removeItem("registration_email");
        localStorage.removeItem("registration_password");

        alert("회원가입 성공");

        navigate("/login");
      } catch (err) {
        console.error("회원가입 실패:", err);
        alert("회원가입 중 문제가 발생했습니다.");
      }
    }
  };

  const isValidNickname = (name) => {
    // Check for Korean, English, or numbers only
    const regex = /^[가-힣a-zA-Z0-9]+$/;
    return regex.test(name) && name.length >= 2 && name.length <= 20;
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* OneMug Brand */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          OneMug
        </h1>
      </div>

      {/* Progress Dots */}
      <ProgressDots currentStep={2} totalSteps={3} />

      {/* Registration Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            닉네임을 정해주세요
          </h2>
          <p className="text-gray-500 text-base leading-6">
            OneMug에서 사용할 닉네임을 설정해주세요
          </p>
        </div>

        {/* Nickname Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nickname Field */}
          <div>
            <label
              htmlFor="nickname"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              닉네임
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="2-20자의 닉네임을 입력해주세요"
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-colors text-base"
              required
              minLength={2}
              maxLength={20}
            />

            {/* Validation Text */}
            <p className="mt-2 text-sm text-gray-500">
              한글, 영문, 숫자 사용 가능
            </p>

            {/* Error Message */}
            {nickname && !isValidNickname(nickname) && (
              <p className="mt-2 text-red-500 text-sm">
                한글, 영문, 숫자만 사용 가능하며 2-20자여야 합니다
              </p>
            )}
          </div>

          {/* Complete Button */}
          <button
            type="submit"
            disabled={!nickname.trim() || !isValidNickname(nickname)}
            className="w-full bg-brand-primary text-white font-medium py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            가입 완료
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-8 space-x-1">
          <span className="text-gray-500 text-sm">이미 계정이 있나요?</span>
          <button
            onClick={handleLogin}
            className="text-brand-primary text-sm hover:text-opacity-80 font-medium transition-colors"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}
