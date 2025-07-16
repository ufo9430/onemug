import React from "react";
import Sidebar from "../components/Sidebar";
import { Button } from "../components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";

const mockCreators = [
  {
    id: "coffee-master",
    name: "Coffee Master",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets%2F96669fc18d0a42e7921a546a167f4728%2F225690d8977549608e6ed4823c342234?format=webp&width=800",
    description: "스페셜티 원두 리뷰어",
    isSubscribed: true,
  },
  {
    id: "growth-hacker",
    name: "Growth Hacker",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets%2F96669fc18d0a42e7921a546a167f4728%2Fa4664d4a45254082babb84389ef91331?format=webp&width=800",
    description: "홈카페 레시피 전문가",
    isSubscribed: false,
  },
];

export default function Subscriptions() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeItem="subscriptions" />
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 lg:py-5">
          <h1 className="text-lg lg:text-xl font-semibold text-gray-900">구독</h1>
        </div>
        {/* Content */}
        <div className="flex-1 bg-gray-50 p-4 lg:p-6">
          <div className="max-w-2xl mx-auto space-y-4">
            {mockCreators.map((creator) => (
              <div
                key={creator.id}
                className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4"
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={creator.avatar} alt={creator.name} />
                  <AvatarFallback>{creator.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{creator.name}</div>
                  <div className="text-sm text-gray-500 truncate">{creator.description}</div>
                </div>
                <Button variant={creator.isSubscribed ? "secondary" : "brand"}>
                  {creator.isSubscribed ? "구독중" : "구독하기"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

