import React from "react"
import { Check } from "lucide-react"
import Sidebar from "../components/Sidebar"

const Membership = () => {
  const membershipTiers = [
    {
      id: "free",
      name: "무료 멤버십",
      description: "기본 콘텐츠 이용",
      price: "무료",
      features: ["공개 게시글 열람", "댓글 작성", "기본 커뮤니��� 참여"],
      isCurrentPlan: true,
      buttonText: "현재 가입중",
      buttonVariant: "current"
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
        "멤버 전용 커뮤니티"
      ],
      buttonText: "멤버십 가입",
      buttonVariant: "secondary"
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
        "특별 이벤트 우선 참여"
      ],
      buttonText: "멤버십 가입",
      buttonVariant: "secondary"
    }
  ]

  const faqs = [
    {
      question: "Q. 멤버십은 언제든 해지할 수 있나요?",
      answer:
        "A. 네, 언제든지 해지 가능하며 해지 시점까지 이용하신 기간에 대해서만 과금��니다."
    },
    {
      question: "Q. 결제 방법은 어떻게 되나요?",
      answer: "A. 신용카드, 체크카드, 계좌이체를 지원합니다."
    },
    {
      question: "Q. 멤버십 혜택은 즉시 적용되나요?",
      answer: "A. 결제 완료 즉시 모든 멤버십 혜택을 이용하실 수 있습니다."
    }
  ]

  const getButtonStyles = variant => {
    switch (variant) {
      case "primary":
        return "bg-brand-primary text-white hover:bg-brand-primary/90"
      case "current":
        return "bg-brand-primary text-white cursor-default"
      case "secondary":
      default:
        return "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
    }
  }

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
          <h1 className="text-xl font-semibold text-gray-900">멤버��</h1>
        </header>

        {/* Content Area */}
        <main className="bg-brand-secondary min-h-[calc(100vh-73px)] p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                멤버십 가입
              </h1>
              <p className="text-gray-600">
                김민정의 프리미엄 콘텐츠를 구독하고 특별한 혜택을 받아보세요
              </p>
            </div>

            {/* Membership Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {membershipTiers.map((tier, index) => (
                <div
                  key={tier.id}
                  className={`relative bg-white rounded-xl border shadow-sm p-6 ${
                    tier.isCurrentPlan
                      ? "border-brand-primary border-2"
                      : "border-gray-200"
                  }`}
                >
                  {tier.isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-brand-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                        현재
                      </span>
                    </div>
                  )}

                  {/* Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {tier.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {tier.description}
                    </p>
                    <div className="flex items-end justify-center">
                      <span className="text-3xl font-bold text-gray-900">
                        {tier.price}
                      </span>
                      {tier.priceUnit && (
                        <span className="text-gray-500 ml-1">
                          {tier.priceUnit}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {tier.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center gap-3"
                      >
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <button
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${getButtonStyles(
                      tier.buttonVariant
                    )}`}
                    disabled={tier.isCurrentPlan}
                  >
                    {tier.buttonText}
                  </button>
                </div>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                자주 묻는 질문
              </h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index}>
                    <h3 className="font-medium text-gray-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Membership
