import React, { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import axios from "@/lib/axios";
import { jwtDecode } from 'jwt-decode';

// axios 기본 URL 설정
axios.defaults.baseURL = '/api';

export default function Subscriptions() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // JWT 토큰에서 사용자 ID 추출하는 함수
  const getUserIdFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      console.log('JWT 페이로드:', decoded);
      
      // 가능한 사용자 ID 필드들을 순서대로 확인
      return decoded.userId || decoded.sub || decoded.id || decoded.user_id;
    } catch (error) {
      console.error('JWT 토큰 디코딩 실패:', error);
      return null;
    }
  };

  // 안전한 사용자 ID 추출 함수
  const getCurrentUserId = () => {
    // 1. 먼저 저장소에서 직접 userId 확인
    let userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    
    if (!userId) {
      // 2. JWT 토큰에서 추출 시도
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        userId = getUserIdFromToken(token);
        
        // 성공적으로 추출한 경우 저장소에 캐시
        if (userId) {
          if (localStorage.getItem('token')) {
            localStorage.setItem('userId', userId);
          } else if (sessionStorage.getItem('token')) {
            sessionStorage.setItem('userId', userId);
          }
        }
      }
    }
    
    return userId;
  };

  // 인증 헤더 생성 함수
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const userId = getCurrentUserId();
    
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      'User-Id': userId || ''
    };
  };

  // 구독 목록 조회
  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError('');
      
      const userId = getCurrentUserId();
      if (!userId) {
        setError('로그인이 필요합니다.');
        setLoading(false);
        return;
      }

      console.log('구독 목록 조회 시작, 사용자 ID:', userId);

      // 사용자의 구독 목록 조회
      const response = await axios.get(`/memberships/my-subscriptions?userId=${userId}`, {
        headers: getAuthHeaders()
      });

      console.log('구독 목록 API 응답:', response.data);
      
      // 구독 데이터를 창작자별로 그룹화
      const creatorsMap = new Map();
      
      response.data.forEach(subscription => {
        const creatorId = subscription.creatorId;
        if (!creatorsMap.has(creatorId)) {
          creatorsMap.set(creatorId, {
            id: creatorId,
            name: subscription.creatorName || '알 수 없는 창작자',
            email: '', // 창작자 이메일 정보가 없으므로 빈 문자열
            description: `${subscription.membershipName || subscription.name} 멤버십을 구독 중입니다.`,
            avatar: '', // 아바타 정보가 없으므로 빈 문자열
            initials: subscription.creatorName ? subscription.creatorName.substring(0, 2).toUpperCase() : '??',
            subscriptions: []
          });
        }
        
        creatorsMap.get(creatorId).subscriptions.push({
          membershipName: subscription.membershipName || subscription.name,
          subscribedAt: subscription.subscribedAt,
          expiresAt: subscription.expiresAt,
          status: subscription.status
        });
      });

      const creatorsArray = Array.from(creatorsMap.values());
      console.log('그룹화된 창작자 목록:', creatorsArray);
      
      setSubscriptions(creatorsArray);
      setLoading(false);
      
    } catch (err) {
      console.error('구독 목록 조회 실패:', err);
      setError('구독 목록을 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 구독 목록 조회
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 flex flex-col w-full lg:w-auto">
          <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 lg:py-5">
            <h1 className="text-lg lg:text-xl font-semibold text-gray-900">
              구독한 창작자
            </h1>
          </div>
          <div className="flex-1 bg-gray-50 p-4 lg:p-6 flex items-center justify-center">
            <p className="text-gray-600">구독 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 flex flex-col w-full lg:w-auto">
          <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 lg:py-5">
            <h1 className="text-lg lg:text-xl font-semibold text-gray-900">
              구독한 창작자
            </h1>
          </div>
          <div className="flex-1 bg-gray-50 p-4 lg:p-6 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchSubscriptions} className="bg-brand-primary hover:bg-brand-primary/90 text-white">
                다시 시도
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 lg:py-5">
          <h1 className="text-lg lg:text-xl font-semibold text-gray-900">
            구독한 창작자
          </h1>
        </div>

        {/* Content */}
        <div className="flex-1 bg-gray-50 p-4 lg:p-6">
          {/* Stats Section */}
          <div className="mb-6 lg:mb-8">
            <h2 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">
              <span className="mr-1">총</span>
              <span className="mr-1">{subscriptions.length}</span>
              <span>명의 창작자를 구독 중입니다</span>
            </h2>
            <p className="text-sm lg:text-base text-gray-600">
              구독한 창작자들의 최신 글을 놓치지 마세요
            </p>
          </div>

          {/* No Subscriptions Message */}
          {subscriptions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                아직 구독한 창작자가 없습니다.
              </p>
              <Button onClick={() => navigate('/explore')} className="bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-2 rounded-lg">
                창작자 탐색하기
              </Button>
            </div>
          ) : (
            <>
              {/* Creators Grid */}
              <div className="space-y-4">
                {subscriptions.map(creator => (
                  <CreatorCard 
                    key={creator.id} 
                    creator={creator} 
                    navigate={navigate}
                  />
                ))}
              </div>

              {/* Call to Action */}
              <div className="text-center mt-8 lg:mt-12">
                <p className="text-sm lg:text-base text-gray-500 mb-4">
                  더 많은 창작자를 찾아보세요
                </p>
                <Button onClick={() => navigate('/explore')} className="bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-2 rounded-lg">
                  창작자 탐색하기
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function CreatorCard({ creator, navigate }) {
  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer max-w-4xl"
      onClick={() => navigate(`/profile/${creator.id}`)}
    >
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12 flex-shrink-0">
          {creator.avatar ? (
            <AvatarImage src={creator.avatar} alt={creator.name} />
          ) : (
            <AvatarFallback className="bg-brand-primary text-white font-semibold">
              {creator.initials}
            </AvatarFallback>
          )}
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1 text-sm lg:text-base">
            {creator.name}
          </h3>
          {creator.email && (
            <p className="text-xs lg:text-sm text-gray-500 mb-2">
              {creator.email}
            </p>
          )}
          <p className="text-xs lg:text-sm text-gray-600 leading-relaxed mb-2">
            {creator.description}
          </p>
          
          {/* 구독 정보 표시 */}
          {creator.subscriptions && creator.subscriptions.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                구독한 멤버십: {creator.subscriptions.map(sub => sub.membershipName).join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
