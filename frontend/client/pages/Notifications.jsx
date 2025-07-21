import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { use } from "react";

// notice 응답 데이터 (response dto)
// [
//   {
//     "noticeId": 0, //알림 ID
//     "targetUserNickname": "string", // 알림 대상(알림 발생시킨) 유저 닉네임
//     "targetUserProfileUrl": "string", // 알림 대상(알림 발생시킨) 유저 프로필 URL
//     "content": "string", // 알림 내용 (noticeType에 들어있는 메시지 내용 (새 글을 작성했습니다))
//     "targetId": 0, //알림 생성된 글이나 멤버십 ID
//     "targetName": "string", //알림 생성된 글의 제목이나 멤버십 이름
//     "createdAt": "2025-07-19T05:52:21.547Z", //알림 생성일
//     "noticeType": "string", //알림 종류
//     "read": true //읽음 여부
//   }
// ]

// 시간 포맷팅 함수
function formatRelativeTime(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);

  const diffSec = Math.floor((now - time) / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return `${diffSec}초 전`;
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  if (diffWeek < 5) return `${diffWeek}주 전`;
  if (diffMonth < 12) return `${diffMonth}개월 전`;
  return `${diffYear}년 전`;
}

// 최근 알림인지 확인하는 함수
// 3일 이내에 도착한 알림을 최근으로 간주
function checkIsRecent(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);
  const diffDays = Math.floor((now - time) / (1000 * 60 * 60 * 24));
  return diffDays <= 3;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/notice", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("서버 응답 실패");
        }
        return response.json();
      })
      .then((data) => {
        console.log("받은 데이터", data);
        const mapped = data.map((n) => ({
          // 알림 데이터 매핑
          id: n.noticeId, // 알림의 고유 ID (React key용 + 읽음 처리용)
          title: `${n.targetUserNickname}님이 ${n.content}`, // 메시지 텍스트 조합 //content(noticeType의 메시지내용)
          description: n.targetName, // 글 제목 or 멤버십 이름
          targetId: n.targetId, // 상세페이지 이동용 (글 or 멤버십 ID)
          timestamp: formatRelativeTime(n.createdAt), //createdAt을 변환해야함 (formatRelativeTime)
          avatar: n.targetUserProfileUrl,
          isUnread: !n.read, // 읽지 않은 알림 여부
          isRecent: checkIsRecent(n.createdAt), //createdAt을 변환해야함(checkIsRecent) //최근, 지난 알림 구분
          type: n.noticeType, //알림 종류
        }));
        console.log("변환한 데이터", mapped);
        setNotifications(mapped);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const recentNotifications = notifications.filter((n) => n.isRecent); //최근 알림
  const pastNotifications = notifications.filter((n) => !n.isRecent); //지난 알림

  const [visibleCount, setVisibleCount] = useState(5);

  // visibleCount 상태를 사용하여 현재 표시할 알림 개수 관리
  // 초기값은 5개로 설정
  // 더보기 버튼 클릭 시 5개씩 증가시켜 표시할 알림 개수를 늘림
  // 이 상태는 지난 알림(pastNotifications)에서만 사용됨
  // 초기값은 5개로 설정하고, 더보기 버튼 클릭 시 5개씩 증가시켜 표시할 알림 개수를 늘림
  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  // 모든 알림을 읽음 처리하는 함수
  // 이를 통해 UI에서 읽지 않은 알림 표시를 제거
  const handleMarkAllAsRead = () => {
    // 백엔드에 모든 알림 읽음 처리 요청
    // POST 요청을 보내어 모든 알림을 읽음 처리
    fetch("http://localhost:8080/notice/read-all", {
      method: "POST",
    })
      .then((response) => {
        // 성공적으로 읽음 처리되면 프론트 상태 업데이트 (isUnread → false)
        if (response.ok) {
          console.log("성공");
          setNotifications((prev) =>
            prev.map((n) => ({ ...n, isUnread: false })),
          );
          location.reload();
        } else {
          console.log("오류발생");
        }
      })
      .catch((error) => {
        console.error("Error marking all as read:", error);
      });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 lg:py-5">
          <div className="flex items-center justify-between">
            <h1 className="text-lg lg:text-xl font-semibold text-gray-900">
              알림
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-gray-500 hover:text-gray-700 text-xs lg:text-sm"
            >
              모두 읽음 처리
            </Button>
          </div>
        </div>

        {/* Notifications */}
        <div className="flex-1 overflow-y-auto">
          {/* 알림이 아예 없을 때 */}
          {notifications.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              아직 도착한 알림이 없습니다.
            </div>
          )}

          {/* 최근 알림 */}
          {recentNotifications.length > 0 && (
            <div className="px-4 lg:px-6 py-4 lg:py-6">
              <h2 className="text-lg lg:text-xl font-semibold text-black mb-4 lg:mb-6">
                최근
              </h2>
              <div className="space-y-1">
                {recentNotifications.map((notification) => (
                  <NotificationItem
                    key={`recent-${notification.id}`}
                    notification={notification}
                    setNotifications={setNotifications}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 지난 알림 */}
          {pastNotifications.length > 0 && (
            <div className="px-4 lg:px-6 py-4 lg:py-6">
              <h2 className="text-lg lg:text-xl font-semibold text-black mb-4 lg:mb-6">
                지난 알림
              </h2>
              <div className="space-y-1">
                {pastNotifications
                  .slice(0, visibleCount)
                  .map((notification) => (
                    <NotificationItem
                      key={`past-${notification.id}`}
                      notification={notification}
                      setNotifications={setNotifications}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* 더보기 버튼 */}
          {/* 지난 알림이 있고, visibleCount가 pastNotifications.length보다 작을 때만 표시 */}
          {/* 더보기 버튼을 클릭하면 visibleCount가 5씩 증가하여 더 많은 알림을 표시 */}
          {pastNotifications.length > visibleCount && (
            <div className="flex justify-center py-8">
              <Button
                variant="ghost"
                size="lg"
                className="rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 h-12 w-12 p-0"
                onClick={handleShowMore}
              >
                <ChevronDown className="h-6 w-6" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NotificationItem({ notification, setNotifications }) {
  // 알림 아이템 컴포넌트
  // 알림 아이템의 스타일을 동적으로 변경하는 함수

  // 읽지 않은 알림은 왼쪽에 강조 표시를 하고, 읽은 알림은 일반 테두리로 표시
  const getBorderStyle = () => {
    if (notification.isUnread) {
      //읽지 않은 알림 - 강조 표시
      return "border-l-4 border-l-brand-primary border-t border-r border-b border-brand-primary";
    }
    return "border border-gray-200";
  };

  // useNavigate 훅을 사용하여 알림 클릭 시 페이지 이동
  const navigate = useNavigate();
  // 알림을 클릭하면 해당 알림의 상세 페이지로 이동하고, 읽음 처리 요청을 보냄
  const handleClick = async () => {
    try {
      // 백엔드에 해당 알림 읽음 처리 요청
      await fetch(`http://localhost:8080/notice/${notification.id}/read`, {
        method: "POST",
      });

      // 알림 타입별로 이동 경로 설정
      const type = notification.type; // 알림 타입 (POST, COMMENT, LIKE, SUBSCRIBE, UNSUBSCRIBE)
      const id = notification.targetId; // 알림 대상 ID (글 ID, 멤버십 ID 등)

      if (type === "POST" || type === "COMMENT" || type === "LIKE") {
        navigate(`/post/${id}`); // 글 상세 페이지로 이동
      } else if (type === "SUBSCRIBE") {
        navigate("/creator/subscribers"); // todo: 창작자의 구독자 목록 페이지 (수정하기)
      } else if (type === "UNSUBSCRIBE") {
        navigate("/user/subscriptions"); // todo: 유저 자신의 구독 내역 페이지 (수정하기)
      }
    } catch (error) {
      console.error("알림 처리 실패:", error);
    }
  };

  return (
    <div
      className={`rounded-lg bg-white p-4 lg:p-6 cursor-pointer hover:shadow-sm transition-shadow ${getBorderStyle()}`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3 lg:gap-4">
        <Avatar className="h-10 w-10 lg:h-12 lg:w-12 flex-shrink-0">
          {/* /public/default-profile.png에 기본 프로필 이미지가 있다고 가정 */}
          {/* 프로필 이미지가 없을 경우 기본 이니셜 표시 */}
          <AvatarImage
            src={notification.avatar || "/default-profile.png"}
            alt="User"
          />
          <AvatarFallback className="bg-gray-200 text-gray-600 font-medium text-xs lg:text-sm">
            {notification.title.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-1 lg:mb-2 text-sm lg:text-base leading-tight">
                {notification.title}
              </h3>
              <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                {notification.description}
              </p>
            </div>
            <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
              <span className="text-xs lg:text-sm text-gray-500 whitespace-nowrap">
                {notification.timestamp}
              </span>
              {notification.isUnread && (
                <div className="h-2 w-2 bg-brand-primary rounded-full"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
