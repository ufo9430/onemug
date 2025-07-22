import React, { useState, useEffect } from "react"
import { useParams, useSearchParams } from 'react-router-dom';
import { Check, AlertCircle, Clock } from "lucide-react"
import PaymentModal from "./PaymentModal"
import axios from "@/lib/axios";

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

  // JWT 토큰 가져오는 함수
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  };

  // 결제 결과 처리
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const membershipId = searchParams.get('membershipId');
    const creatorId = searchParams.get('creatorId');
    const membershipName = searchParams.get('membershipName');
    const price = searchParams.get('price');
    const paymentKey = searchParams.get('paymentKey');
    const paymentOrderId = searchParams.get('orderId');
    const paymentAmount = searchParams.get('amount');
    const paymentMethodType = searchParams.get('method');

    console.log('URL 파라미터:', {
      paymentStatus,
      membershipId,
      creatorId,
      membershipName,
      price,
      paymentKey,
      paymentOrderId,
      paymentAmount,
      paymentMethodType
    });
    
    // 결제 성공 시 구독 생성 요청
    if (paymentStatus === 'success') {
      console.log('결제 성공 처리 시작');
      
      // 멤버십 ID가 있는 경우에만 구독 생성 요청
      if (membershipId) {
        // 문자열 값을 적절한 숫자로 변환
        const numericMembershipId = Number(membershipId);
        const numericCreatorId = Number(creatorId);
        const numericPrice = Number(price);
        
        // 필수 파라미터 유효성 검증
        if (isNaN(numericMembershipId) || isNaN(numericCreatorId) || !membershipName) {
          console.error('필수 파라미터가 올바르지 않습니다:', { membershipId, creatorId, membershipName });
          alert('결제는 성공했지만 필수 정보가 올바르지 않습니다. 관리자에게 문의하세요.');
          setSearchParams({});
          return;
        }
        
        // 백엔드에서 기대하는 형식으로 구독 생성 요청 데이터 준비
        const subscriptionData = {
          membershipId: numericMembershipId,
          creatorId: numericCreatorId,
          membershipName: decodeURIComponent(membershipName),
          orderId: paymentOrderId,
          paymentMethod: paymentMethodType || 'TOSS',
          price: numericPrice || 0,
          autoRenew: true
        };
        
        // 디버깅을 위해 토큰 확인
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        console.log('현재 사용 중인 토큰:', token ? `${token.substring(0, 20)}...` : '토큰 없음');
        
        console.log('구독 생성 요청 데이터:', subscriptionData);
        
        // 백엔드에 구독 생성 요청
        axios.post('/memberships/create', subscriptionData, {
          headers: getAuthHeaders()
        })
        .then(response => {
          console.log('구독 생성 결과:', response.data);
          if (response.data.status === 'SUCCESS') {
            alert('결제가 완료되었습니다! 멤버십이 활성화되었습니다.');
            // 멤버십 목록 새로고침
            fetchMemberships();
          } else {
            alert('결제는 완료되었지만 멤버십 활성화에 실패했습니다. 고객센터에 문의해주세요.');
          }
          
          // 처리 완료 후 URL 파라미터 제거
          setSearchParams({});
        })
        .catch(error => {
          console.error('구독 생성 중 오류 발생:', error);
          if (error.response) {
            // 서버에서 응답을 받았지만 2xx 범위가 아닌 경우
            console.error('서버 응답:', error.response.data);
            console.error('상태 코드:', error.response.status);
            console.error('헤더:', error.response.headers);
            alert(`구독 생성 실패: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
          } else if (error.request) {
            // 요청이 이루어졌으나 응답을 받지 못한 경우
            console.error('요청은 전송되었지만 응답이 없습니다:', error.request);
            alert('서버 응답이 없습니다. 네트워크 상태를 확인해주세요.');
          } else {
            // 요청 설정 중에 오류가 발생한 경우
            console.error('요청 설정 중 오류 발생:', error.message);
            alert(`오류 발생: ${error.message}`);
          }
          
          // 오류 발생해도 URL 파라미터 제거
          setSearchParams({});
        });
      } else {
        alert('결제가 완료되었지만 멤버십 정보가 없습니다. 관리자에게 문의해주세요.');
        setSearchParams({});
      }
    } else if (paymentStatus === 'fail') {
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

  // 무료 멤버십 생성 함수 (프론트엔드 하드코딩)
  const getFreeMembership = (creatorId = 1) => {
    return {
      id: "free-membership-" + creatorId,
      membershipName: "무료 멤버십",
      name: "무료 멤버십",
      creatorId: creatorId,
      creatorName: "onemug",
      price: 0,
      isTemplate: true,
      benefits: [
        "크리에이터 콘텐츠 제한적 접근",
        "기본 피드백 제공",
        "커뮤니티 참여 가능"
      ]
    };
  };

  const fetchMemberships = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // 백엔드에서 템플릿 멤버십 조회 (isTemplate = true)
      // 새로운 템플릿 전용 엔드포인트 사용
      let url = '/memberships/templates'
      
      // creatorId가 있으면 해당 크리에이터의 템플릿 멤버십만 조회
      if (creatorId) {
        url += `/creator/${creatorId}`
      }
      
      console.log('멤버십 템플릿 API 호출:', url);
      
      const response = await axios.get(url, {
        headers: getAuthHeaders()
      });

      console.log('API 응답 (원본):', response.data);
      
      let membershipsData = [];
      
      if (Array.isArray(response.data)) {
        membershipsData = response.data;
      } else {
        console.warn('API 응답이 배열이 아닙니다:', response.data);
      }
      
      // 하드코딩된 무료 멤버십 추가 (항상 추가)
      const freeMembership = getFreeMembership(creatorId ? parseInt(creatorId) : 1);
      console.log('하드코딩된 무료 멤버십 추가:', freeMembership);
      
      // 무료 멤버십을 배열 시작에 추가
      const allMemberships = [freeMembership, ...membershipsData];
      
      // Benefits 및 멤버십 속성 디버깅 로그 추가
      allMemberships.forEach((membership, index) => {
        console.log(`멤버십 ${index + 1} [ID:${membership.id}]:`, {
          name: membership.membershipName || membership.name,
          price: membership.price,
          isTemplate: membership.isTemplate,
          benefits: membership.benefits,
          creatorId: membership.creatorId
        });
      });
      
      // 가격 오름차순으로 정렬
      const sortedMemberships = allMemberships.sort((a, b) => a.price - b.price);
      
      // 모든 멤버십을 표시
      setMemberships(sortedMemberships);
      
      // 무료 멤버십이 하나도 없는 경우 디버그 로그 (이제 항상 있어야 함)
      const freeMemberships = sortedMemberships.filter(m => m.price === 0);
      console.log('무료 멤버십 템플릿 발견:', freeMemberships.length, '개', freeMemberships);
      
    } catch (err) {
      console.error('멤버십 정보 불러오기 실패:', err);
      if (err.response) {
        console.error('오류 응답:', err.response.status, err.response.data);
      }
      
      // API 요청이 실패해도 무료 멤버십은 표시
      const freeMembership = getFreeMembership(creatorId ? parseInt(creatorId) : 1);
      console.log('오류 발생 - 무료 멤버십만 표시:', freeMembership);
      setMemberships([freeMembership]);
      
      setError('유료 멤버십 정보를 불러오는데 실패했습니다. 무료 멤버십만 표시됩니다.');
    } finally {
      setLoading(false)
    }
  };

  // 무료 멤버십 구독 여부 확인
  const checkFreeMembershipStatus = async () => {
    try {
      const response = await axios.get('/memberships/my-subscriptions', {
        headers: getAuthHeaders()
      });
      
      if (response.data) {
        const subscriptions = response.data
        
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
        autoRenew: false,
        paymentMethod: membership.price === 0 ? 'FREE' : 'CARD' // 무료 또는 카드 결제
      }
      
      // 하드코딩된 무료 멤버십인 경우 특별 처리
      const isFree = membership.price === 0;
      const isHardcodedFreeMembership = typeof membership.id === 'string' && 
                                      membership.id.startsWith('free-membership');
      
      if (isFree && isHardcodedFreeMembership) {
        console.log('하드코딩된 무료 멤버십 처리:', membership);
        
        // Yes/No 알림창 표시
        if (window.confirm('무료 멤버십을 구독하시겠습니까?')) {
          try {
            // 백엔드에 실제로 저장할 데이터 준비
            // 하드코딩된 ID 대신 실제 백엔드에서 사용할 수 있는 데이터 구성
            const realSubscriptionData = {
              // membershipId는 DB에 실제로 있는 무료 멤버십 ID로 변경하거나
              // 백엔드에서 자동 생성되도록 null 전송
              membershipId: null,
              membershipName: membership.membershipName || membership.name,
              price: 0,
              creatorId: creatorId ? parseInt(creatorId) : 1, // 기본값 1
              autoRenew: false,
              paymentMethod: 'FREE',
              // 추가 식별 정보
              isFreeHardcoded: true
            }
            
            console.log('무료 멤버십 생성 요청 데이터:', realSubscriptionData);
            
            // 백엔드에 무료 멤버십 생성 요청
            const response = await axios.post('/memberships/create', realSubscriptionData, {
              headers: getAuthHeaders()
            });
            
            console.log('무료 멤버십 생성 응답:', response.data);
            
            if (response.data && response.data.status === 'SUCCESS') {
              // 성공 시 상태 업데이트
              setHasFreeMembership(true);
              alert('무료 멤버십 구독이 완료되었습니다!');
              
              // 구독 목록 새로고침
              await checkFreeMembershipStatus();
              await fetchMemberships();
            } else {
              setError('무료 멤버십 구독에 실패했습니다: ' + (response.data?.message || '알 수 없는 오류'));
            }
          } catch (err) {
            console.error('무료 멤버십 생성 오류:', err);
            if (err.response) {
              console.error('오류 응답:', err.response.status, err.response.data);
              setError(`무료 멤버십 생성 오류: ${err.response.status} - ${err.response.data?.message || '알 수 없는 오류'}`);
            } else {
              setError('서버 연결에 실패했습니다.');
            }
          }
        } else {
          // No를 선택한 경우
          console.log('무료 멤버십 구독 취소');
          setSelectedMembership(null);
        }
        
        return;
      }
      
      console.log('멤버십 유효성 검증 시작:', subscriptionData)
      const validationResponse = await axios.post('/memberships/validate', subscriptionData, {
        headers: getAuthHeaders()
      })

      if (!validationResponse.data.valid) {
        const errorText = validationResponse.data.errorMessage
        console.error('멤버십 유효성 검증 실패:', errorText)
        setError(`멤버십 유효성 검증 실패: ${errorText}`)
        return
      }

      const validationResult = validationResponse.data
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
        
        // 무료 멤버십이면 자동으로 확인 처리
        if (membership.price === 0) {
          handleConfirmSelection();
        }
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
        const createResponse = await axios.post('/memberships/create', selectionResult.subscriptionData, {
          headers: getAuthHeaders()
        })
        
        const createResult = createResponse.data
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
        
        const createResponse = await axios.post('/memberships/create', subscriptionData, {
          headers: getAuthHeaders()
        })
        
        const createResult = createResponse.data
        
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
              {memberships && memberships.length > 0 ? (
                memberships.map((membership) => {
                  // 멤버십 데이터 유효성 검증 (예상치 못한 형식의 데이터 보호)
                  const membershipId = membership?.id || 'unknown';
                  const membershipName = membership?.membershipName || membership?.name || '이름 없음';
                  const creatorName = membership?.creatorName || '알 수 없음';
                  const price = typeof membership?.price === 'number' ? membership.price : 0;
                  const benefits = Array.isArray(membership?.benefits) ? membership.benefits : [];
                  const isFree = price === 0;
                  
                  console.log(`멤버십 렌더링 [${membershipId}]:`, { membershipName, price, isFree });
                  
                  return (
                    <div
                      key={membershipId}
                      className={`relative bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow ${
                        isFree
                          ? 'border-green-200 ring-2 ring-green-100' 
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex flex-col h-full">
                        {/* Free Membership Badge */}
                        {isFree && (
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            무료
                          </div>
                        )}
                        
                        {/* Header */}
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {membershipName}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            {creatorName}
                          </p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-gray-900">
                              ₩{price.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500">/월</span>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-3 mb-6 flex-1">
                          {benefits.length > 0 ? (
                            benefits.map((benefit, index) => (
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
                          disabled={selectedMembership && selectedMembership.id === membershipId}
                        >
                          {selectedMembership && selectedMembership.id === membershipId ? '선택 중...' : '멤버십 선택'}
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-3 p-6 text-center bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-gray-500">멤버십 템플릿이 없거나 로딩 중입니다.</p>
                  <p className="text-sm text-gray-400 mt-2">사용 가능한 멤버십이 없는 경우 크리에이터에게 문의하세요.</p>
                </div>
              )}
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
