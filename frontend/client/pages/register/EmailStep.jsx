import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

export default function EmailStep() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // Store email in localStorage or context
      localStorage.setItem("registration_email", email);
      navigate("/register/password");
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* OneMug Brand */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">OneMug</h1>
      </div>
      {/* Progress Dots */}
      <ProgressDots currentStep={0} totalSteps={3} />
      {/* Registration Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">이메일을 입력해주세요</h2>
          <p className="text-gray-500 text-base leading-6">
            OneMug 계정으로 사용할 이메일 주소를 입력해주세요
          </p>
        </div>
        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">이메일</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-colors text-base"
              required
            />
          </div>
          {/* Next Button */}
          <button
            type="submit"
            className="w-full bg-brand-primary text-white font-medium py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            다음
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
