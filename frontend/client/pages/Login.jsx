import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"

const SocialButton = ({ provider, icon, className, children }) => (
  <button
    className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-medium text-base transition-colors ${className}`}
  >
    {icon}
    {children}
  </button>
)

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login attempt:", { email, password, rememberMe })
  }

  const handleSignUp = () => {
    navigate("/welcome")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">로그인</h1>
          <p className="text-gray-500 text-base">
            계정에 로그인하여 더 많은 콘텐츠를 만나보세요
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              이메일
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-colors"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              비밀번호
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-2 border-gray-300 text-brand-primary focus:ring-brand-primary"
              />
              <span className="text-sm text-gray-700">로그인 상태 유지</span>
            </label>
            <button
              type="button"
              className="text-sm text-brand-primary hover:text-opacity-80 font-medium"
            >
              비밀번호 찾기
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-brand-primary text-white font-medium py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            로그인
          </button>
        </form>

        {/* Divider */}
        <div className="my-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">또는</span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          <SocialButton
            provider="google"
            className="border border-gray-300 hover:bg-gray-50 text-gray-700"
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M18.8 10.2084C18.8 9.55837 18.7417 8.93337 18.6333 8.33337H10V11.8834H14.9333C14.7167 13.025 14.0667 13.9917 13.0917 14.6417V16.95H16.0667C17.8 15.35 18.8 13 18.8 10.2084Z"
                  fill="#4285F4"
                />
                <path
                  d="M9.99974 19.1667C12.4747 19.1667 14.5497 18.35 16.0664 16.95L13.0914 14.6417C12.2747 15.1917 11.2331 15.525 9.99974 15.525C7.61641 15.525 5.59141 13.9167 4.86641 11.75H1.81641V14.1167C3.32474 17.1083 6.41641 19.1667 9.99974 19.1667Z"
                  fill="#34A853"
                />
                <path
                  d="M4.86634 11.7417C4.68301 11.1917 4.57467 10.6084 4.57467 10.0001C4.57467 9.39172 4.68301 8.80839 4.86634 8.25839V5.89172H1.81634C1.19134 7.12506 0.833008 8.51672 0.833008 10.0001C0.833008 11.4834 1.19134 12.8751 1.81634 14.1084L4.19134 12.2584L4.86634 11.7417Z"
                  fill="#FBBC05"
                />
                <path
                  d="M9.99974 4.48337C11.3497 4.48337 12.5497 4.95004 13.5081 5.85004L16.1331 3.22504C14.5414 1.74171 12.4747 0.833374 9.99974 0.833374C6.41641 0.833374 3.32474 2.89171 1.81641 5.89171L4.86641 8.25837C5.59141 6.09171 7.61641 4.48337 9.99974 4.48337Z"
                  fill="#EA4335"
                />
              </svg>
            }
          >
            Google로 로그인
          </SocialButton>

          <SocialButton
            provider="kakao"
            className="bg-social-kakao hover:bg-opacity-90 text-gray-900"
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 2.5C14.8325 2.5 18.75 5.55333 18.75 9.32083C18.75 13.0875 14.8325 16.1408 10 16.1408C9.51881 16.1411 9.0381 16.1105 8.56083 16.0492L4.8875 18.4517C4.47 18.6725 4.3225 18.6483 4.49417 18.1075L5.2375 15.0425C2.8375 13.8258 1.25 11.7175 1.25 9.32083C1.25 5.55417 5.1675 2.5 10 2.5Z"
                  fill="black"
                />
              </svg>
            }
          >
            카카오로 로그인
          </SocialButton>

          <SocialButton
            provider="naver"
            className="bg-social-naver hover:bg-opacity-90 text-white"
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g clipPath="url(#clip0_21_410)">
                  <path
                    d="M13.5608 10.7042L6.14667 0H0V20H6.43833V9.29667L13.8533 20H20V0H13.5608V10.7042Z"
                    fill="black"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_21_410">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            }
          >
            네이버로 로그인
          </SocialButton>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-8">
          <button
            onClick={handleSignUp}
            className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  )
}
