import React, { useState, useEffect } from "react"
import { useParams, useSearchParams } from 'react-router-dom';
import { Check, AlertCircle, Clock } from "lucide-react"
import Sidebar from "../components/Sidebar"
import PaymentModal from "./PaymentModal"

const Membership = () => {
    const { creatorId } = useParams(); // URL에서 creatorId 추출
    const [searchParams, setSearchParams] = useSearchParams();
  const [memberships, setMemberships] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMembership, setSelectedMembership] = useState(null)
  const [selectionResult, setSelectionResult] = useState(null)
  const [autoRenew, setAutoRenew] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState("카드")
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  // 결제 결과 처리
  useEffect(() => {
    const paymentResult = searchParams.get('payment');
    if (paymentResult === 'success') {
      alert('결제가 완료되었습니다! 멤버십이 활성화되었습니다.');
      // URL에서 쿼리 파라미터 제거
      setSearchParams({});
    } else if (paymentResult === 'fail') {
      setError('결제에 실패했습니다. 다시 시도해주세요.');
      // URL에서 쿼리 파라미터 제거
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  // 멤버십 목록 조회
  useEffect(() => {
    fetchMemberships()
  }, [creatorId])

  const fetchMemberships = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let url = 'http://localhost:8080/memberships'
      
      // creatorId가 있으면 해당 크리에이터의 멤버십만 조회
      if (creatorId) {
        url += `/creator/${creatorId}`
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Id': '1' // 임시 사용자 ID
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('API Response:', data)
      
      // 백엔드에서 가져온 데이터에서 무료 멤버십(price === 0) 제외
      // 무료 멤버십은 프론트엔드에서 직접 관리
      const paidMemberships = data.filter(membership => membership.price > 0);
      
      // 유료 멤버십만 가격 오름차순으로 정렬
      const sortedMemberships = paidMemberships.sort((a, b) => a.price - b.price);
      
      setMemberships(sortedMemberships)
    } catch (err) {
      console.error('Error fetching memberships:', err)
      setError('멤버십 정보를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  };

  // 멤버십 선택 처리
  const handleMembershipSelect = async (membership) => {
    try {
      setSelectedMembership(membership)
      setError(null)
      
      // 무료 멤버십인 경우 프론트엔드에서 직접 처리
      if (membership.isFreeMembership) {
        setSelectionResult({
          selectionId: 'free-membership-selection',
          membershipId: membership.id,
          membershipName: membership.name,
          price: 0,
          creatorId: membership.creatorId,
          isFree: true,
          status: 'SUCCESS',
          message: '무료 멤버십이 선택되었습니다.'
        })
        return
      }
      
      // 유료 멤버십인 경우 기존 로직 유지
      const response = await fetch('http://localhost:8080/memberships/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Id': '1' // 임시 사용자 ID
        },
        body: JSON.stringify({
          membershipId: membership.id,
          creatorId: membership.creatorId
        })
      })

      const result = await response.json()
      
      if (response.ok && result.status !== 'ERROR') {
        // 유료 멤버십인 경우 isFree를 명시적으로 false로 설정
        const enhancedResult = {
          ...result,
          isFree: false,
          price: membership.price,
          membershipName: membership.name
        }
        setSelectionResult(enhancedResult)
        console.log('유료 멤버십 선택 결과:', enhancedResult)
      } else {
        setError(result.message || '선택에 실패했습니다.')
      }
    } catch (err) {
      console.error('Error selecting membership:', err)
      setError('서버 연결에 실패했습니다.')
    }
  }

  // 선택 확인 처리
  const handleConfirmSelection = async () => {
    if (!selectionResult) return

    console.log('선택 확인 처리 시작:', selectionResult)

    // 무료 멤버십인 경우 백엔드에 기록
    if (selectionResult.isFree) {
      console.log('무료 멤버십 처리 시작')
      try {
        // 무료 멤버십 가입 기록을 백엔드에 전송
        const response = await fetch('http://localhost:8080/memberships/free-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Id': '1' // 임시 사용자 ID
          },
          body: JSON.stringify({
            membershipName: selectionResult.membershipName,
            creatorId: selectionResult.creatorId,
            price: 0,
            autoRenew: false // 무료 멤버십은 자동 갱신 없음
          })
        })

        if (response.ok) {
          alert('무료 멤버십 가입이 완료되었습니다!')
          setSelectionResult(null)
          setSelectedMembership(null)
        } else {
          // 백엔드 기록 실패해도 프론트엔드에서는 성공 처리
          alert('무료 멤버십 가입이 완료되었습니다!')
          setSelectionResult(null)
          setSelectedMembership(null)
          console.warn('무료 멤버십 백엔드 기록 실패, 프론트엔드에서 처리 완료')
        }
      } catch (err) {
        // 네트워크 오류가 있어도 무료 멤버십은 성공 처리
        alert('무료 멤버십 가입이 완료되었습니다!')
        setSelectionResult(null)
        setSelectedMembership(null)
        console.warn('무료 멤버십 백엔드 기록 실패, 프론트엔드에서 처리 완료:', err)
      }
    } else {
      // 유료 멤버십인 경우 결제 모달 열기
      console.log('유료 멤버십 처리 - 결제 모달 열기')
      setShowPaymentModal(true)
    }
  }

  // 결제 성공 처리
  const handlePaymentSuccess = (paymentData) => {
    alert('결제가 완료되었습니다! 멤버십이 활성화되었습니다.')
    setShowPaymentModal(false)
    setSelectionResult(null)
    setSelectedMembership(null)
    // 필요시 페이지 새로고침 또는 데이터 재조회
    // window.location.reload()
  }

  // 결제 실패 처리
  const handlePaymentFailed = (error) => {
    console.error('결제 실패:', error)
    setShowPaymentModal(false)
    setError('결제에 실패했습니다. 다시 시도해주세요.')
  }

  const getButtonStyles = (variant) => {
    switch (variant) {
      case "current":
        return "bg-gray-100 text-gray-500 cursor-not-allowed"
      case "primary":
        return "bg-amber-500 hover:bg-amber-600 text-white"
      case "secondary":
        return "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
      default:
        return "bg-gray-100 text-gray-500"
    }
  }

  // 무료 멤버십 객체 (프론트엔드에서 직접 선언)
  const getFreeMembership = () => ({
    id: 'free-membership',
    name: '무료 멤버십',
    price: 0,
    creatorId: creatorId ? parseInt(creatorId) : null,
    creatorName: '모든 크리에이터',
    description: '기본 무료 멤버십입니다.',
    benefits: ['기본 콘텐츠 이용', '커뮤니티 참여'],
    isFree: true,
    isFreeMembership: true // 프론트엔드에서 생성된 무료 멤버십 식별자
  })

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">멤버십 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  const faqs = [
    {
      question: "멤버십은 언제든지 해지할 수 있나요?",
      answer: "네, 언제든지 해지하실 수 있습니다. 해지 후에도 결제한 기간까지는 모든 혜택을 이용하실 수 있습니다."
    },
    {
      question: "멤버십 혜택은 언제부터 적용되나요?",
      answer: "결제 완료 즉시 모든 멤버십 혜택이 적용됩니다."
    },
    {
      question: "멤버십을 업그레이드할 수 있나요?",
      answer: "네, 언제든지 상위 멤버십으로 업그레이드하실 수 있습니다. 차액만 결제하시면 됩니다."
    },
    {
      question: "환불 정책은 어떻게 되나요?",
      answer: "결제 후 7일 이내에 환불 요청하시면 전액 환불해드립니다. 단, 혜택을 사용하신 경우 일부 제한이 있을 수 있습니다."
    }
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="max-w-6xl mx-auto p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">멤버십</h1>
              <p className="text-gray-600">
                다양한 멤버십 혜택을 만나보세요. 창작자와 더 가깝게 소통하고 특별한 콘텐츠를 경험해보세요.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            {/* Selection Result */}
            {selectionResult && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-blue-900">멤버십 선택 완료</h3>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-blue-800">
                    <strong>{selectionResult.membershipName}</strong> 멤버십이 선택되었습니다.
                  </p>
                  <p className="text-blue-700">
                    선택 만료 시간: {selectionResult.expiresAt ? new Date(selectionResult.expiresAt).toLocaleString() : '-'}
                  </p>
                  <p className="text-blue-700">
                    자동 갱신: {selectionResult.autoRenew ? '활성화' : '비활성화'}
                  </p>
                  {/* 무료/유료 안내 */}
                  <p className="text-blue-700">
                    {selectionResult.isFree ? '무료 플랜입니다. 즉시 가입 가능합니다.' : '유료 플랜입니다. 결제 후 이용 가능합니다.'}
                  </p>
                  {/* 안내 메시지 */}
                  {selectionResult.message && (
                    <p className="text-blue-600">{selectionResult.message}</p>
                  )}
                  {/* 현재 구독 중인 멤버십과 비교 */}
                  {selectionResult.currentSubscribedMembership && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-yellow-800 font-medium mb-1">현재 구독 중인 플랜</p>
                      <p className="text-yellow-700 text-sm">
                        {selectionResult.currentSubscribedMembership.name} (₩{selectionResult.currentSubscribedMembership.price?.toLocaleString()} /월)
                        <span className="ml-2">[{selectionResult.currentSubscribedMembership.status}]</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Membership Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[getFreeMembership(), ...memberships].map((membership) => (
                <div
                  key={membership.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {membership.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {membership.creatorName}
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900">
                          ₩{membership.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">/월</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-6 flex-1">
                      {membership.benefits && membership.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    {/* Button */}
                    <button
                      onClick={() => handleMembershipSelect(membership)}
                      className="w-full py-3 px-6 rounded-lg font-medium transition-colors bg-amber-500 hover:bg-amber-600 text-white"
                      disabled={selectedMembership && selectedMembership.id === membership.id}
                    >
                      {selectedMembership && selectedMembership.id === membership.id ? '선택 중...' : '멤버십 선택'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Selection Result Section */}
            {selectionResult && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  선택된 멤버십
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">멤버십:</span>
                    <span className="text-sm text-gray-900">{selectionResult.membershipName}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">가격:</span>
                    <span className="text-sm text-gray-900">
                      {selectionResult.price === 0 ? '무료' : `₩${selectionResult.price.toLocaleString()}/월`}
                    </span>
                  </div>
                  {selectionResult.message && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">{selectionResult.message}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleConfirmSelection}
                    className="flex-1 py-3 px-6 rounded-lg font-medium transition-colors bg-green-500 hover:bg-green-600 text-white"
                  >
                    결제 확인
                  </button>
                  <button
                    onClick={() => {
                      setSelectionResult(null)
                      setSelectedMembership(null)
                    }}
                    className="flex-1 py-3 px-6 rounded-lg font-medium transition-colors bg-gray-500 hover:bg-gray-600 text-white"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}

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
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          membership={selectedMembership}
          selectionResult={selectionResult}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailed={handlePaymentFailed}
        />
      )}
    </div>
  )
}

export default Membership
