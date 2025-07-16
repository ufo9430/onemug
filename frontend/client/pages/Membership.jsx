import React from "react";
import Sidebar from "../components/Sidebar";

const membershipTiers = [
  {
    id: "free",
    name: "무료 멤버십",
    description: "기본 콘텐츠 이용",
    price: "무료",
    features: ["공개 게시글 열람", "댓글 작성", "기본 커뮤니티 참여"],
    isCurrentPlan: true,
    buttonText: "현재 가입중",
    buttonVariant: "current",
  },
  {
    id: "basic",
    name: "베이직 멤버십",
    description: "프리미엄 콘텐츠 접근",
    price: "₩9,900",
    priceUnit: "/월",
    features: [
      "모든 프리미엄 게시글",
      "월 2회 라이브 세션",
      "커피 레시피 PDF 다운로드",
      "멤버 전용 커뮤니티",
    ],
    buttonText: "멤버십 가입",
    buttonVariant: "secondary",
  },
  {
    id: "premium",
    name: "프리미엄 멤버십",
    description: "모든 혜택 + 개인 상담",
    price: "₩19,900",
    priceUnit: "/월",
    features: [
      "베이직 멤버십 모든 혜택",
      "월 1회 개인 커피 상담",
      "원두 할인 쿠폰 (월 3매)",
      "우선 질문 답변",
      "특별 이벤트 우선 참여",
    ],
    buttonText: "멤버십 가입",
    buttonVariant: "secondary",
  },
];

const faqs = [
  {
    question: "Q. 멤버십은 언제든 해지할 수 있나요?",
    answer:
      "A. 네, 언제든지 해지 가능하며 해지 시점까지 이용하신 기간에 대해서만 과금됩니다.",
  },
  {
    question: "Q. 결제 방법은 어떻게 되나요?",
    answer: "A. 신용카드, 체크카드, 계좌이체를 지원합니다.",
  },
  {
    question: "Q. 멤버십 혜택은 즉시 적용되나요?",
    answer: "A. 결제 완료 즉시 모든 멤버십 혜택을 이용하실 수 있습니다.",
  },
];

const getButtonStyles = (variant) => {
  switch (variant) {
    case "primary":
      return "bg-brand-primary text-white hover:bg-brand-primary/90";
    case "current":
      return "bg-brand-primary text-white cursor-default";
    case "secondary":
    default:
      return "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200";
  }
};

const Membership = () => {
  return (
    <div className="min-h-screen bg-brand-secondary flex">
      {/* Sidebar */}
      <Sidebar activeItem="feed" />
      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="h-[73px] bg-white border-b border-gray-200 flex items-center px-6">
          <div className="lg:hidden mr-4">
            <h2 className="text-lg font-bold text-gray-900">OneMug</h2>
          </div>
          <h1 className="text-xl font-bold text-gray-900">멤버십</h1>
        </header>
        {/* Membership Tiers */}
        <main className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {membershipTiers.map((tier) => (
              <div key={tier.id} className={`bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col items-center ${tier.isCurrentPlan ? "border-brand-primary" : ""}`}>
                <h2 className="text-lg font-bold text-gray-900 mb-2">{tier.name}</h2>
                <div className="text-2xl font-bold text-brand-primary mb-2">{tier.price}<span className="text-base font-normal text-gray-500">{tier.priceUnit || ""}</span></div>
                <div className="text-gray-700 mb-4">{tier.description}</div>
                <ul className="list-disc pl-5 text-gray-600 mb-6 self-start">
                  {tier.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${getButtonStyles(tier.buttonVariant)}`}
                  disabled={tier.buttonVariant === "current"}
                >
                  {tier.buttonText}
                </button>
              </div>
            ))}
          </div>
          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 max-w-2xl mx-auto">
            <h3 className="text-lg font-bold mb-6">자주 묻는 질문</h3>
            <ul className="space-y-4">
              {faqs.map((faq, idx) => (
                <li key={idx}>
                  <div className="font-semibold text-gray-900 mb-1">{faq.question}</div>
                  <div className="text-gray-700">{faq.answer}</div>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Membership;
