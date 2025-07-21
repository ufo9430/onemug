import React from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const mockCreators = [
  {
    id: "minjung-kim",
    name: "MinJung Kim",
    email: "minjung_kim@abc.abc",
    description:
      "스페셜티 커피와 홈카페 장비에 대한 ���직한 리뷰를 공유합니다.",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/d070bb3f3d147d90540e7d98e4dd02c871952923?width=96",
    initials: "MK"
  },
  {
    id: "sarah-lee",
    name: "Sarah Lee",
    email: "sarah.lee@foodie.com",
    description: "간단하고 맛있는 홈쿠킹 레시피를 소개하는 요리 블로거입니다.",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/5d2834afc7963d55d5d199f654a96a19417aaf2b?width=96",
    initials: "SL"
  },
  {
    id: "david-park",
    name: "David Park",
    email: "david.park@startup.io",
    description: "스타트업 경험과 비즈니스 인사이트를 나누는 기업가입니다.",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/d1d722c46c1dfd3e034405a3b6051614d9455505?width=96",
    initials: "DP"
  },
  {
    id: "alex-chen",
    name: "Alex Chen",
    email: "alex.chen@dev.com",
    description: "풀스택 개발자로서 실무 경험과 기술 트렌드를 공유합니다.",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/1137ba6772ac4b05b3fc5f235bf9668b48a0cf34?width=96",
    initials: "AC"
  },
  {
    id: "emma-wilson",
    name: "Emma Wilson",
    email: "emma.wilson@design.co",
    description: "UI/UX 디자이너로서 디자인 프로세스와 트렌드를 다룹니다.",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/979e0e182bb6e4c7b8031962abab95691df338c8?width=96",
    initials: "EW"
  },
  {
    id: "james-kim",
    name: "James Kim",
    email: "james.kim@travel.blog",
    description:
      "세계 각지의 숨겨진 명소와 여행 팁을 소개하는 여행 작가입니다.",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/08b950ff985dae4a6755b6d232da100fd3378bdb?width=96",
    initials: "JK"
  }
]

export default function Subscriptions() {
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
              <span className="mr-1">6</span>
              <span>명의 창작자를 구독 중입니다</span>
            </h2>
            <p className="text-sm lg:text-base text-gray-600">
              구독한 창작자들의 최신 글을 놓치지 마세요
            </p>
          </div>

          {/* Creators Grid */}
          <div className="space-y-4">
            {mockCreators.map(creator => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-8 lg:mt-12">
            <p className="text-sm lg:text-base text-gray-500 mb-4">
              더 많은 창작자를 찾아보세요
            </p>
            <Button className="bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-2 rounded-lg">
              창작자 탐색하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CreatorCard({ creator }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer max-w-4xl">
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12 flex-shrink-0">
          <AvatarImage src={creator.avatar} alt={creator.name} />
          <AvatarFallback className="bg-brand-primary text-white font-semibold">
            {creator.initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1 text-sm lg:text-base">
            {creator.name}
          </h3>
          <p className="text-xs lg:text-sm text-gray-500 mb-2">
            {creator.email}
          </p>
          <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
            {creator.description}
          </p>
        </div>
      </div>
    </div>
  )
}
