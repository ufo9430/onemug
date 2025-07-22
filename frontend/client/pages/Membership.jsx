import React, { useState, useEffect } from "react"
import { useParams, useSearchParams } from 'react-router-dom';
import { Check, AlertCircle, Clock } from "lucide-react"
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
  const [hasFreeMembership, setHasFreeMembership] = useState(false) // 무료 멤버십 구독 여부

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
    checkFreeMembershipStatus() // 무료 멤버십 구독 여부 확인
  }, [creatorId])

  const fetchMemberships = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // 백엔드에서 템플릿 멤버십 조회 (isTemplate = true)
      // 새로운 템플릿 전용 엔드포인트 사용
      let url = 'http://localhost:8080/memberships/templates'
      
      // creatorId가 있으면 해당 크리에이터의 템플릿 멤버십만 조회
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
      
      // Benefits 디버깅 로그 추가
      data.forEach((membership, index) => {
        console.log(`멤버십 ${index + 1} [${membership.membershipName}] Benefits:`, membership.benefits);
      });
      
      // 백엔드에서 템플릿만 가져오므로 필터링 불필요
      // 가격 오름차순으로 정렬
      const sortedMemberships = data.sort((a, b) => a.price - b.price);
      
      // 무료 멤버십을 이미 구독하지 않은 경우에도 백엔드에서 받은 데이터만 사용
      setMemberships(sortedMemberships)
    } catch (err) {
      console.error('Error fetching memberships:', err)
      setError('멤버십 정보를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  };

  // 무료 멤버십 구독 여부 확인
  const checkFreeMembershipStatus = async () => {
    try {
      const response = await fetch('http://localhost:8080/memberships/my-subscriptions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Id': '1' // 임시 사용자 ID
        }
      })
      
      if (response.ok) {
        const subscriptions = await response.json()
        
        // 무료 멤버십 (가격이 0원인 활성 구독) 확인
        const hasFree = subscriptions.some(sub => 
          sub.price === 0 && 
          sub.status === 'ACTIVE' && 
          new Date(sub.expiresAt) > new Date()
        )
        
        setHasFreeMembership(hasFree)
        console.log('무료 멤버십 구독 여부:', hasFree)
      }
    } catch (error) {
      console.error('무료 멤버십 구독 상태 확인 실패:', error)
    }
  }

  // 멤버십 선택 처리 - 새로운 API 구조에 맞게 수정
  const handleMembershipSelect = async (membership) => {
    try {
      setSelectedMembership(membership)
      setError(null)
      
      // 무료/유료 공통 처리 로직 - 유효성 검증
      // 구독 데이터 구성
      const subscriptionData = {
        membershipId: membership.id,
        membershipName: membership.membershipName || membership.name,
        price: membership.price,
        creatorId: creatorId ? parseInt(creatorId) : membership.creatorId,
        userId: 1,
        autoRenew: false,
        paymentMethod: membership.price === 0 ? 'FREE' : 'CARD' // 무료 또는 카드 결제
      }
      
      console.log('멤버십 유효성 검증 시작:', subscriptionData)
      const validationResponse = await fetch('http://localhost:8080/memberships/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Id': '1'
        },
        body: JSON.stringify(subscriptionData)
      })

      if (!validationResponse.ok) {
        const errorText = await validationResponse.text()
        console.error('멤버십 유효성 검증 실패:', errorText)
        setError(`멤버십 유효성 검증 실패: ${validationResponse.status}`)
        return
      }

      const validationResult = await validationResponse.json()
      console.log('멤버십 유효성 검증 결과:', validationResult)
      
      if (validationResult.valid) {
        // 일반 성공 케이스 또는 업그레이드 가능 케이스
        const isUpgrade = validationResult.upgradable === true
        let message = '';
        
        // 무료/유료 멤버십에 따라 다른 메시지 표시
        if (membership.price === 0) {
          message = '무료 멤버십을 구독하시겠습니까?';
          if (isUpgrade) {
            message = '기존 멤버십을 취소하고 무료 멤버십으로 다운그레이드 하시겠습니까?';
          }
        } else {
          message = isUpgrade 
            ? '멤버십 업그레이드가 가능합니다. 결제를 진행하면 기존 멤버십은 자동으로 취소됩니다.'
            : '유료 멤버십이 선택되었습니다. 결제를 진행해주세요.';
        }
        
        setSelectionResult({
          membershipId: membership.id,
          membershipName: membership.membershipName || membership.name,
          price: membership.price,
          creatorId: membership.creatorId,
          isFree: membership.price === 0,
          isUpgrade: isUpgrade,
          currentMembershipId: validationResult.currentMembershipId,
          status: 'SUCCESS',
          message: message,
          subscriptionData: subscriptionData
        })
        
        console.log(
          membership.price === 0 
            ? '무료 멤버십 선택 성공:' 
            : (isUpgrade ? '멤버십 업그레이드 성공:' : '유료 멤버십 선택 성공:'), 
          membership
        )
      } else {
        console.error('멤버십 유효성 검증 실패:', validationResult)
        setError(validationResult.errorMessage || '멤버십 구독에 실패했습니다.')
      }
    } catch (err) {
      console.error('Error selecting membership:', err)
      setError('서버 연결에 실패했습니다.')
    }
  }

  // 선택 확인 처리 - 새로운 API 구조에 맞게 수정
  const handleConfirmSelection = async () => {
    if (!selectionResult) return

    console.log('선택 확인 처리 시작:', selectionResult)

    // 무료 멤버십인 경우 직접 구독 생성
    if (selectionResult.isFree) {
      try {
        // 무료 멤버십 생성
        const createResponse = await fetch('http://localhost:8080/memberships/create?userId=1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Id': '1'
          },
          body: JSON.stringify(selectionResult.subscriptionData)
        })
        
        const createResult = await createResponse.json()
        console.log('무료 멤버십 생성 결과:', createResult)
        
        if (createResult.status === 'SUCCESS') {
          alert('무료 멤버십을 구독하신걸 축하드립니다!')
          setSelectedMembership(null)
          setSelectionResult(null)
          // 무료 멤버십 상태 업데이트
          setHasFreeMembership(true)
          // 멤버십 목록 새로고침하여 무료 멤버십 숨기기
          await fetchMemberships()
          return // 여기서 리턴하여 하위 로직 실행 방지
        } else {
          setError(createResult.message || '무료 멤버십 구독에 실패했습니다.')
          return
        }
      } catch (error) {
        console.error('무료 멤버십 구독 중 오류:', error)
        setError('무료 멤버십 구독 중 오류가 발생했습니다.')
        return
      }
    }
    
    // 유료 멤버십인 경우 결제 모달 열기
    console.log('유료 멤버십 처리 - 결제 모달 열기')
    setShowPaymentModal(true)
  }

  // 결제 성공 처리 - 실제 구독 생성
  const handlePaymentSuccess = async (paymentData) => {
    try {
      // 결제 성공 후 실제 구독 생성
      if (selectionResult && selectionResult.subscriptionData) {
        // 구독 데이터 복사 후 업그레이드 정보 추가
        const subscriptionData = { ...selectionResult.subscriptionData }
        
        // 업그레이드인 경우 현재 멤버십 ID 추가
        if (selectionResult.isUpgrade && selectionResult.currentMembershipId) {
          subscriptionData.currentMembershipId = selectionResult.currentMembershipId
          console.log('업그레이드 요청:', subscriptionData)
        }
        
        const createResponse = await fetch('http://localhost:8080/memberships/create?userId=1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Id': '1'
          },
          body: JSON.stringify(subscriptionData)
        })
        
        const createResult = await createResponse.json()
        
        if (createResult.status === 'SUCCESS') {
          // 업그레이드인 경우 메시지 다르게 표시
          const successMessage = selectionResult.isUpgrade 
            ? '결제가 완료되었습니다! 멤버십이 업그레이드되었습니다.'
            : '결제가 완료되었습니다! 멤버십이 활성화되었습니다.'
            
          alert(successMessage)
          setShowPaymentModal(false)
          setSelectionResult(null)
          setSelectedMembership(null)
          // 필요시 페이지 새로고침 또는 데이터 재조회
          // window.location.reload()
        } else {
          console.error('구독 생성 실패:', createResult)
          alert('결제는 완료되었지만 멤버십 활성화에 실패했습니다. 고객센터에 문의해주세요.')
          setShowPaymentModal(false)
        }
      } else {
        // selectionResult가 없는 경우 기본 성공 처리
        alert('결제가 완료되었습니다! 멤버십이 활성화되었습니다.')
        setShowPaymentModal(false)
        setSelectionResult(null)
        setSelectedMembership(null)
      }
    } catch (error) {
      console.error('결제 후 구독 생성 중 오류:', error)
      alert('결제는 완료되었지만 멤버십 활성화에 실패했습니다. 고객센터에 문의해주세요.')
      setShowPaymentModal(false)
    }
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

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
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
                  {selectionResult.currentMembershipId && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-yellow-800 font-medium mb-1">현재 구독 중인 플랜</p>
                      <p className="text-yellow-700 text-sm">
                        {selectionResult.currentMembershipId} (₩{selectionResult.price?.toLocaleString()} /월)
                        <span className="ml-2">[{selectionResult.status}]</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Membership Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memberships.map((membership) => (
                <div
                  key={membership.id}
                  className={`relative bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow ${
                    membership.price === 0 
                      ? 'border-green-200 ring-2 ring-green-100' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex flex-col h-full">
                    {/* Free Membership Badge */}
                    {membership.price === 0 && (
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        무료
                      </div>
                    )}
                    
                    {/* Header */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {membership.membershipName || membership.name}
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
                      {membership.benefits && membership.benefits.length > 0 ? (
                        membership.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{benefit}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500 italic">
                          혜택 정보가 없습니다.
                        </div>
                      )}
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
