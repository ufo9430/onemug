import React, { useState, useEffect } from "react"
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Check, AlertCircle, Clock } from "lucide-react"
import PaymentModal from "./PaymentModal"
import axios from "@/lib/axios";

// axios 기본 URL 설정
axios.defaults.baseURL = '/api';

const Membership = () => {
    const { creatorId } = useParams(); // URL에서 creatorId 추출
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate(); // React Router navigate 훅 추가
  const [memberships, setMemberships] = useState([])
  const [selectedMembership, setSelectedMembership] = useState(null)
  const [selectionResult, setSelectionResult] = useState(null)
  const [hasFreeMembership, setHasFreeMembership] = useState(false)
  const [currentSubscriptions, setCurrentSubscriptions] = useState([]) // 현재 구독 목록
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState('') // 'processing', 'success', 'fail'
  const [resultMessage, setResultMessage] = useState('')
  const [autoRenew, setAutoRenew] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState("카드")
  const [paymentOrderId, setPaymentOrderId] = useState(null)
  const [paymentAmount, setPaymentAmount] = useState(null)

  // JWT 토큰에서 사용자 ID 추출하는 함수
  const getUserIdFromToken = (token) => {
    if (!token) {
      console.log('JWT 토큰이 없습니다');
      return null;
    }
    
    try {
      console.log('JWT 토큰 디코딩 시도:', token.substring(0, 20) + '...');
      
      // JWT 토큰의 페이로드(payload) 부분 디코딩
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('유효하지 않은 JWT 토큰 형식입니다:', token);
        return null;
      }
      
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      // base64 디코딩을 위한 패딩 추가
      const pad = '='.repeat((4 - base64.length % 4) % 4);
      const base64Padded = base64 + pad;
      
      // 디코딩 시도
      let jsonPayload;
      try {
        jsonPayload = decodeURIComponent(
          atob(base64Padded)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
      } catch (e) {
        console.error('base64 디코딩 실패:', e);
        
        // 다른 방법으로 디코딩 시도
        try {
          jsonPayload = window.atob(base64Padded);
          console.log('Raw decoded payload:', jsonPayload);
        } catch (e2) {
          console.error('alternative decoding also failed:', e2);
          return null;
        }
      }
      
      try {
        const payload = JSON.parse(jsonPayload);
        console.log('JWT 페이로드:', payload);
        
        // 페이로드에서 userId 또는 sub 필드를 찾아 반환
        // Spring Security는 일반적으로 'sub' 필드에 사용자 식별자를 저장
        const userId = payload.userId || payload.sub || payload.id || null;
        console.log('JWT 토큰에서 추출한 userId:', userId);
        return userId;
      } catch (parseError) {
        console.error('JSON 파싱 실패:', parseError, 'raw payload:', jsonPayload);
        return null;
      }
    } catch (error) {
      console.error('JWT 토큰 디코딩 중 오류 발생:', error);
      return null;
    }
  };

  // JWT 토큰 및 User-Id 가져오는 함수
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    // 먼저 저장소에서 userId 직접 조회
    let userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    
    // userId가 없으면 JWT 토큰에서 추출 시도
    if (!userId && token) {
      userId = getUserIdFromToken(token);
      console.log('JWT 토큰에서 추출한 userId:', userId);
      
      // 추출한 userId 저장소에 캐싱
      if (userId) {
        if (localStorage.getItem('token')) {
          localStorage.setItem('userId', userId);
        } else if (sessionStorage.getItem('token')) {
          sessionStorage.setItem('userId', userId);
        }
      }
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      'User-Id': userId || ''
    };
  };

  useEffect(() => {
    // URL 파라미터에서 결제 관련 정보 가져오기
    const query = new URLSearchParams(location.search);
    
    const paymentKey = query.get('paymentKey');
    const orderId = query.get('orderId');
    const amount = query.get('amount');
    
    console.log(' URL 파라미터 디버깅:', {
      현재URL: window.location.href,
      search파라미터: location.search,
      paymentKey: paymentKey,
      orderId: orderId,
      amount: amount
    });
    
    // URL에 결제 정보가 있으면 결제 확인 처리
    if (paymentKey && orderId && amount) {
      console.log(' 결제 콜백 URL 감지됨:', { paymentKey, orderId, amount });
      setPaymentStatus('processing'); // 결제 처리 중 상태로 변경
      setResultMessage('결제 확인 중입니다...');
      
      // 로컬 스토리지에서 결제 요청 데이터 가져오기
      const paymentOrderId = orderId;
      const paymentAmount = amount;
      const membershipId = localStorage.getItem('selectedMembershipId');
      const creatorId = localStorage.getItem('selectedCreatorId');
      
      // 사용자 ID 확인
      let currentUserId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
      
      // userId가 없으면 JWT 토큰에서 추출 시도
      if (!currentUserId) {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
          currentUserId = getUserIdFromToken(token);
          
          // 추출한 userId 저장소에 캐싱
          if (currentUserId) {
            if (localStorage.getItem('token')) {
              localStorage.setItem('userId', currentUserId);
            } else if (sessionStorage.getItem('token')) {
              sessionStorage.setItem('userId', currentUserId);
            }
          }
        }
      }
      
      console.log('로컬 스토리지 데이터:', { 
        selectedMembershipId: membershipId,
        selectedCreatorId: creatorId,
        currentUserId: currentUserId
      });
      
      // 멤버십 정보가 없는 경우, 다시 멤버십 페이지로 돌아가 선택하도록 안내
      if (!membershipId) {
        console.error('선택한 멤버십 정보가 없습니다.');
        setPaymentStatus('fail');
        setResultMessage('선택한 멤버십 정보가 없습니다. 다시 멤버십을 선택해주세요.');
        
        // 사용자 ID가 있는지 확인 - 있다면 해당 크리에이터 멤버십 페이지로 리다이렉트
        if (currentUserId && creatorId) {
          setTimeout(() => {
            navigate(`/membership/${creatorId}`);
          }, 3000);
        } else {
          // 사용자 ID나 크리에이터 ID가 없으면 메인 멤버십 페이지로 이동
          setTimeout(() => {
            navigate('/membership');
          }, 3000);
        }
        return;
      }
      
      console.log('결제 확인에 사용할 사용자 ID:', currentUserId);
      
      // 문자열을 숫자로 명시적 변환
      const numericUserId = parseInt(currentUserId, 10);
      if (isNaN(numericUserId)) {
        console.error('유효하지 않은 사용자 ID 형식입니다:', currentUserId);
        setPaymentStatus('fail');
        setResultMessage('로그인 정보가 올바르지 않습니다. 다시 로그인해주세요.');
        
        // 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate('/login');
        }, 3000);
        return;
      }
      
      // 데이터 형식 변환 및 정제 (paymentKey 검증 강화)
      if (!paymentKey || paymentKey.trim() === '') {
        console.error('❌ paymentKey가 비어있습니다:', paymentKey);
        setPaymentStatus('fail');
        setResultMessage('결제 정보가 올바르지 않습니다. 다시 시도해주세요.');
        return;
      }
      
      if (!orderId || orderId.trim() === '') {
        console.error('❌ orderId가 비어있습니다:', orderId);
        setPaymentStatus('fail');
        setResultMessage('주문 정보가 올바르지 않습니다. 다시 시도해주세요.');
        return;
      }
      
      // 백엔드 DTO 타입에 맞게 데이터 변환
      const confirmData = {
        paymentKey: String(paymentKey).trim(),
        orderId: String(paymentOrderId).trim(),
        amount: parseInt(paymentAmount, 10), // Long 타입으로 변환 (JavaScript에서는 number)
        userId: numericUserId, // Long 타입으로 변환 
        membershipId: parseInt(membershipId, 10) // Long 타입으로 변환
      };
      
      console.log('✅ 최종 결제 확인 요청 데이터:', confirmData);
      
      try {
        // 필수 데이터 재검증
        if (!confirmData.paymentKey || !confirmData.orderId || !confirmData.amount || !confirmData.membershipId) {
          throw new Error('필수 결제 정보가 누락되었습니다');
        }

        if (!numericUserId || isNaN(numericUserId)) {
          throw new Error('유효한 사용자 ID가 없습니다. 다시 로그인해주세요');
        }
        
        // 숫자 타입 검증
        if (isNaN(confirmData.amount) || confirmData.amount <= 0) {
          throw new Error('유효하지 않은 결제 금액입니다');
        }
        
        if (isNaN(confirmData.membershipId) || confirmData.membershipId <= 0) {
          throw new Error('유효하지 않은 멤버십 ID입니다');
        }
        
        // 백엔드에 결제 확인 요청 (단일 엔드포인트만 사용)
        const apiUrl = '/payments/confirm';
        
        console.log(`🚀 API 호출 시작: ${apiUrl}`);
        
        const headers = {
          ...getAuthHeaders(),
          'User-Id': String(numericUserId), // 백엔드 @RequestHeader에서 Long으로 파싱됨
          'Content-Type': 'application/json'
        };
        
        console.log('📤 요청 헤더:', headers);
        console.log('📤 요청 본문:', JSON.stringify(confirmData, null, 2));
        
        axios.post(apiUrl, confirmData, { headers })
          .then((response) => {
            console.log('결제 확인 성공:', response.data);
            setPaymentStatus('success');
            setResultMessage('멤버십 구독이 완료되었습니다!');
            
            // 결제 완료 후 로컬 스토리지의 임시 정보 정리
            localStorage.removeItem('selectedMembershipId');
            localStorage.removeItem('selectedCreatorId');
            
            // 3초 후 메인 Feed로 이동
            setTimeout(() => {
              navigate('/feed'); // 메인 Feed 페이지로 이동
            }, 3000);
          })
          .catch((error) => {
            console.error('결제 확인 실패:', error.response || error);
            
            if (error.response && error.response.status === 400) {
              console.log('400 에러 응답 세부 정보:', error.response.data);
              console.log('요청 데이터 확인:', error.config?.data);
            }
            
            handlePaymentError(error);
          });
      } catch (error) {
        console.error('결제 확인 전처리 중 오류:', error);
        setPaymentStatus('fail');
        setResultMessage(error.message || '결제 처리 중 오류가 발생했습니다.');
        
        // 오류가 발생한 경우 5초 후 멤버십 페이지로 이동
        setTimeout(() => {
          navigate('/membership');
        }, 5000);
      }
    }
  }, [location]); // URL이 변경될 때마다 결제 확인 처리

  // 멤버십 목록 조회
  useEffect(() => {
    fetchMemberships()
    checkFreeMembershipStatus() // 무료 멤버십 구독 여부 확인
    fetchCurrentSubscriptions() // 현재 구독 목록 가져오기
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
      
      // 가격 오름차순으로 정렬
      const sortedMemberships = allMemberships.sort((a, b) => a.price - b.price);
      
      // 모든 멤버십을 표시
      setMemberships(sortedMemberships);
      
    } catch (err) {
      console.error('멤버십 정보 불러오기 실패:', err);
      console.error('오류 세부 정보:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        responseData: err.response?.data,
        requestConfig: {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers,
          data: err.config?.data
        }
      });
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
      // 사용자 ID 가져오기
      const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
      
      // 인증 헤더 준비
      const headers = getAuthHeaders();
      
      if (!userId) {
        console.warn('사용자 ID가 없어 구독 상태를 확인할 수 없습니다.');
        return;
      }
      
      console.log('내 구독 목록 조회 요청. 사용자 ID:', userId);
      console.log('요청 헤더:', headers);
      
      const response = await axios.get('/memberships/my-subscriptions', {
        headers,
        params: { userId } // 쿼리 파라미터로 사용자 ID 전달
      });
      
      if (response.data) {
        const subscriptions = response.data;
        console.log('내 구독 목록 조회 성공:', subscriptions);
        
        // 무료 멤버십 (가격이 0원인 활성 구독) 확인
        const hasFree = subscriptions.some(sub => 
          sub.price === 0 && 
          sub.status === 'ACTIVE' && 
          new Date(sub.expiresAt) > new Date()
        );
        
        setHasFreeMembership(hasFree);
        console.log('무료 멤버십 구독 여부:', hasFree);
      }
    } catch (error) {
      console.error('무료 멤버십 구독 상태 확인 실패:', error);
      console.error('오류 세부 정보:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        requestConfig: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      });
      
      // 인증 오류인 경우 로그인 페이지로 리다이렉트하지 않고 단순 로깅만
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.warn('구독 목록 조회 중 인증 오류 발생. 로그인 필요할 수 있음.');
      }
    }
  }

  // 현재 구독 목록 가져오기
  const fetchCurrentSubscriptions = async () => {
    try {
      // 사용자 ID 가져오기
      const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
      
      // 인증 헤더 준비
      const headers = getAuthHeaders();
      
      if (!userId) {
        console.warn('사용자 ID가 없어 구독 목록을 가져올 수 없습니다.');
        return;
      }
      
      console.log('내 구독 목록 조회 요청. 사용자 ID:', userId);
      console.log('요청 헤더:', headers);
      
      const response = await axios.get('/memberships/my-subscriptions', {
        headers,
        params: { userId } // 쿼리 파라미터로 사용자 ID 전달
      });
      
      if (response.data) {
        const subscriptions = response.data;
        console.log('내 구독 목록 조회 성공:', subscriptions);
        
        setCurrentSubscriptions(subscriptions);
      }
    } catch (error) {
      console.error('구독 목록 가져오기 실패:', error);
      console.error('오류 세부 정보:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        requestConfig: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      });
    }
  };

  // 멤버십 선택 처리 - 새로운 API 구조에 맞게 수정
  const handleMembershipSelect = async (membership) => {
    try {
      setSelectedMembership(membership)
      setError(null)
      
      // 로컬 스토리지에 선택한 멤버십 정보 저장 (결제 콜백에서 사용)
      localStorage.setItem('selectedMembershipId', membership.id);
      localStorage.setItem('selectedCreatorId', creatorId ? creatorId : membership.creatorId);
      
      console.log('로컬 스토리지에 멤버십 정보 저장:', {
        selectedMembershipId: membership.id,
        selectedCreatorId: creatorId ? creatorId : membership.creatorId
      });
      
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
            console.error('오류 세부 정보:', {
              message: err.message,
              status: err.response?.status,
              statusText: err.response?.statusText,
              responseData: err.response?.data,
              requestConfig: {
                url: err.config?.url,
                method: err.config?.method,
                headers: err.config?.headers,
                data: err.config?.data
              }
            });
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
      console.error('Error selecting membership:', err);
      console.error('오류 세부 정보:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        responseData: err.response?.data,
        requestConfig: {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers,
          data: err.config?.data
        }
      });
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
        console.error('무료 멤버십 구독 중 오류:', error);
        console.error('오류 세부 정보:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          responseData: error.response?.data,
          requestConfig: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
            data: error.config?.data
          }
        });
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
      console.error('결제 후 구독 생성 중 오류:', error);
      console.error('오류 세부 정보:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        requestConfig: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      });
      alert('결제는 완료되었지만 멤버십 활성화에 실패했습니다. 고객센터에 문의해주세요.')
      setShowPaymentModal(false)
    }
  }

  // 결제 실패 처리
  const handlePaymentFailed = (error) => {
    console.error('결제 실패:', error);
    console.error('오류 세부 정보:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      requestConfig: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.config?.data
      }
    });
    setShowPaymentModal(false)
    setError('결제에 실패했습니다. 다시 시도해주세요.')
  }

  // 결제 오류 처리 함수
  const handlePaymentError = (error) => {
    console.error('결제 처리 중 오류 발생:', error);
    
    // 오류 응답이 있는 경우 상세 분석
    if (error.response) {
      const { status, data } = error.response;
      console.error(`HTTP 상태 코드: ${status}`, data);
      
      // 상태 코드별 처리
      switch (status) {
        case 400: // Bad Request
          setResultMessage('결제 정보가 올바르지 않습니다. 다시 시도해주세요.');
          console.error('잘못된 요청 데이터:', data);
          break;
        case 401: // Unauthorized
          setResultMessage('인증에 실패했습니다. 다시 로그인해주세요.');
          // 3초 후 로그인 페이지로 리다이렉트
          setTimeout(() => {
            navigate('/login');
          }, 3000);
          break;
        case 403: // Forbidden
          setResultMessage('해당 작업에 대한 권한이 없습니다.');
          break;
        case 404: // Not Found
          setResultMessage('결제 처리 API를 찾을 수 없습니다.');
          break;
        case 500: // Internal Server Error
          setResultMessage('서버 오류가 발생했습니다. 나중에 다시 시도해주세요.');
          break;
        default:
          setResultMessage(`결제 처리 중 오류가 발생했습니다. (${status})`);
      }
    } else if (error.request) {
      // 요청은 보냈으나 응답을 받지 못한 경우
      console.error('응답을 받지 못했습니다:', error.request);
      setResultMessage('서버 응답이 없습니다. 인터넷 연결을 확인해주세요.');
    } else {
      // 요청 전송 단계에서 오류 발생
      console.error('요청 설정 중 오류 발생:', error.message);
      setResultMessage('결제 요청 중 오류가 발생했습니다.');
    }
    
    // 결제 상태를 실패로 설정
    setPaymentStatus('fail');
    
    // 오류 세부 정보 로깅 (개발 디버깅용)
    if (error.config) {
      console.log('요청 설정:', {
        url: error.config.url,
        method: error.config.method,
        headers: error.config.headers,
        data: error.config.data
      });
    }
    
    // 5초 후 멤버십 페이지로 리다이렉트
    setTimeout(() => {
      navigate('/membership');
    }, 5000);
  };

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
                  
                  // 현재 구독 중인 멤버십인지 확인
                  const isCurrentlySubscribed = currentSubscriptions.some(sub => {
                    // 1. ID로 직접 매칭 (정확한 매칭)
                    if (sub.id === membershipId || 
                        sub.membershipId === membershipId ||
                        sub.templateId === membershipId) {
                      console.log(`✅ ID 매칭으로 구독 확인: ${membershipId}`);
                      return true;
                    }
                    
                    // 2. 멤버십 이름과 창작자로 매칭 (fallback)
                    const subName = sub.membershipName || sub.name;
                    const subCreatorName = sub.creatorName;
                    
                    if (subName === membershipName && subCreatorName === creatorName) {
                      console.log(`✅ 이름+창작자 매칭으로 구독 확인: ${subName} by ${subCreatorName}`);
                      return true;
                    }
                    
                    return false;
                  });
                  
                  if (isCurrentlySubscribed) {
                    console.log(`🚫 중복 구독 방지: ${membershipName} (${creatorName})`);
                  }
                  
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
                          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                            isCurrentlySubscribed 
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                              : 'bg-amber-500 hover:bg-amber-600 text-white'
                          }`}
                          disabled={isCurrentlySubscribed}
                        >
                          {isCurrentlySubscribed ? '이미 구독 중...' : '멤버십 선택'}
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
