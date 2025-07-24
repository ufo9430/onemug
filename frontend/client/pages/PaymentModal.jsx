import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, membership, selectionResult, onPaymentSuccess, onPaymentFailed }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 토스페이먼츠 클라이언트 키 (환경변수에서 가져오기)
  const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY || 'test_ck_DpexMgkW36xJ0RYpWm4wrGbR5ozO';

  // Props 유효성 검증
  if (!isOpen || !membership || !selectionResult) {
    return null;
  }

  // 주문 ID 생성
  const generateOrderId = () => {
    return `order_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  };

  // 토스페이먼츠 결제 요청
  const handlePayment = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      // 토스페이먼츠 SDK 로드
      const { loadTossPayments } = await import('@tosspayments/payment-sdk');
      const tossPayments = await loadTossPayments(clientKey);

      // 결제 요청 데이터
      const paymentData = {
        amount: membership.price,
        orderId: generateOrderId(),
        orderName: `${membership.creatorName} - ${membership.name}`,
        successUrl: `${window.location.origin}/Membership/creator/${membership.creatorId}?payment=success&membershipId=${membership.id}&creatorId=${membership.creatorId}&membershipName=${encodeURIComponent(membership.name || membership.membershipName)}&price=${membership.price}`,
        failUrl: `${window.location.origin}/Membership/creator/${membership.creatorId}?payment=fail`,
        metadata: {
          membershipId: membership.id,
          selectionId: selectionResult?.selectionId,
          creatorId: membership.creatorId
        }
      };

      // 카드 결제로 바로 진행
      await tossPayments.requestPayment('카드', paymentData);

      // 결제 창이 열리면 모달 닫기
      onClose();
      
    } catch (error) {
      console.error('결제 요청 실패:', error);
      setError(`결제 요청에 실패했습니다: ${error.message}`);
      if (onPaymentFailed) {
        onPaymentFailed(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 모달이 열리자마자 결제 진행
  useEffect(() => {
    if (isOpen && membership && selectionResult) {
      const timer = setTimeout(() => {
        handlePayment();
      }, 500); // 0.5초 후 자동 실행

      return () => clearTimeout(timer);
    }
  }, [isOpen, membership, selectionResult]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">결제 진행 중</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {/* 멤버십 정보 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-2">
            {membership.creatorName}
          </h3>
          <p className="text-sm text-gray-600 mb-3">{membership.name}</p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-brand-primary">
              ₩{membership.price?.toLocaleString()}/월
            </span>
          </div>
        </div>

        {/* 결제 진행 상태 */}
        <div className="text-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-sm text-gray-600">토스페이먼츠 결제 창을 여는 중...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">잠시 후 결제 창이 열립니다.</p>
              <button
                onClick={handlePayment}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                결제 창 열기
              </button>
            </div>
          )}
        </div>

        {/* 안내 문구 */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            안전한 결제를 위해 토스페이먼츠를 사용합니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
