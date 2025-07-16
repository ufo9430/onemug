import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-secondary px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-primary mb-4">Welcome to OneMug</h1>
        <p className="text-gray-600 mb-8">커피와 소통이 만나는 곳, OneMug에 오신 것을 환영합니다!</p>
        <div className="flex flex-col gap-4">
          <button
            className="w-full bg-brand-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors text-lg"
            onClick={() => navigate("/login")}
          >
            로그인
          </button>
          <button
            className="w-full bg-gray-100 text-brand-primary font-semibold py-3 px-6 rounded-lg border border-brand-primary hover:bg-brand-primary hover:text-white transition-colors text-lg"
            onClick={() => navigate("/register/email")}
          >
            회원가입
          </button>
        </div>
      </div>
      <footer className="mt-8 text-gray-400 text-xs">© {new Date().getFullYear()} OneMug. All rights reserved.</footer>
    </div>
  );
}
