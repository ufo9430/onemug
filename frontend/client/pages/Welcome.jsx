import { useNavigate } from "react-router-dom"

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
)

export default function Welcome() {
  const navigate = useNavigate()

  const handleNext = () => {
    navigate("/register/email")
  }

  const handleLogin = () => {
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* OneMug Brand */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          OneMug
        </h1>
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-md mx-auto">
        {/* Content Image Placeholder */}
        <div className="w-full h-72 bg-gray-200 rounded-2xl shadow-lg mb-12 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">OneMug Content</p>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">
            다양한 창작자들의 이야기를
            <br />
            만나보세요
          </h2>
          <p className="text-gray-500 text-base">
            커피부터 개발, 요리까지 전문가들의 깊이 있는 콘텐츠
          </p>
        </div>

        {/* Progress Dots */}
        <ProgressDots currentStep={0} totalSteps={3} />

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="w-full bg-brand-primary text-white font-medium py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors mb-6"
        >
          다음
        </button>

        {/* Login Link */}
        <div className="text-center">
          <button
            onClick={handleLogin}
            className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
          >
            이미 계정이 있나요?{" "}
            <span className="text-brand-primary font-medium">로그인</span>
          </button>
        </div>
      </div>
    </div>
  )
}
