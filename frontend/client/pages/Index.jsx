import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/welcome");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-secondary">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center justify-center gap-3">
          <svg
            className="animate-spin h-8 w-8 text-brand-primary"
            viewBox="0 0 50 50"
          >
            <circle
              className="opacity-30"
              cx="25"
              cy="25"
              r="20"
              stroke="currentColor"
              strokeWidth="5"
              fill="none"
            />
            <circle
              className="text-brand-primary"
              cx="25"
              cy="25"
              r="20"
              stroke="currentColor"
              strokeWidth="5"
              fill="none"
              strokeDasharray="100"
              strokeDashoffset="75"
            />
          </svg>
          OneMug 시작하기...
        </h1>
        <p className="mt-4 text-gray-600 max-w-md">
          창작자들의 이야기를 만나보세요
        </p>
      </div>
    </div>
  );
}
