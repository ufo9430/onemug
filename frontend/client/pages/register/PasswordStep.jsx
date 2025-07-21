import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

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

export default function PasswordStep() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      password.trim() &&
      password === confirmPassword &&
      password.length >= 8
    ) {
      // Store password in localStorage or context
      localStorage.setItem("registration_password", password);
      navigate("/register/nickname");
    }
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
      <ProgressDots currentStep={1} totalSteps={3} />

      {/* Registration Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            비밀번호를 설정해주세요
          </h2>
          <p className="text-gray-500 text-base leading-6">
            안전한 비밀번호를 설정하여 계정을 보호하세요
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              비밀번호
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8자 이상 입력해주세요"
                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-colors text-base pr-12"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              비밀번호 확인
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 다시 입력해주세요"
                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-colors text-base pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Validation Message */}
          {password && confirmPassword && password !== confirmPassword && (
            <p className="text-red-500 text-sm">비밀번호가 일치하지 않습니다</p>
          )}

          {/* Next Button */}
          <button
            type="submit"
            disabled={
              !password.trim() ||
              password !== confirmPassword ||
              password.length < 8
            }
            className="w-full bg-brand-primary text-white font-medium py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
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
            ��그인
          </button>
        </div>
      </div>
    </div>
  );
}
