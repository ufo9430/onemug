import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import CreatorSidebar from "../components/CreatorSidebar"

const CreatorInsights = () => {
  const navigate = useNavigate()
  const [selectedPeriod, setSelectedPeriod] = useState("30")

  const periods = [
    { value: "7", label: "7일" },
    { value: "30", label: "30일" },
    { value: "90", label: "90일" }
  ]

  const membershipData = {
    total: "2,847,000원",
    growth: "+12.5%",
    chartData: [
      { month: "10월", height: 31 },
      { month: "11월", height: 35 },
      { month: "12월", height: 38 }
    ]
  }

  const subscribersData = {
    total: "1,247명",
    growth: "+8.3%",
    breakdown: [
      { type: "베이직", count: "847명", color: "#F3F4F6" },
      { type: "프리미엄", count: "324명", color: "#E5E7EB" },
      { type: "VIP", count: "76명", color: "#591600" }
    ]
  }

  const viewsData = {
    total: "28,533",
    growth: "+15.7%"
  }

  return (
    <div className="min-h-screen bg-brand-secondary flex">
      {/* Creator Sidebar */}
      <CreatorSidebar activeItem="insights" />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="h-[73px] bg-white border-b border-gray-200 flex items-center px-6">
          <div className="lg:hidden mr-4">
            <h2 className="text-lg font-bold text-gray-900">OneMug</h2>
          </div>
          <h1 className="text-xl font-bold text-gray-900">인사이트</h1>
        </header>

        {/* Content Area */}
        <main className="bg-brand-secondary min-h-[calc(100vh-73px)] p-6">
          <div className="max-w-6xl mx-auto">
            {/* Time Period Tabs */}
            <div className="flex gap-2 mb-8">
              {periods.map(period => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPeriod === period.value
                      ? "bg-brand-primary text-white"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Membership Income Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                  총 멤버십 수입
                </h3>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {membershipData.total}
                </div>
                <div className="text-sm text-gray-500 mb-6">
                  지난 달 대비 {membershipData.growth}
                </div>

                {/* Mini Bar Chart */}
                <div className="bg-gray-50 rounded-lg p-4 h-16 flex items-end justify-center gap-8">
                  {membershipData.chartData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="w-4 bg-brand-primary rounded-sm mb-1"
                        style={{ height: `${item.height}px` }}
                      />
                      <span className="text-xs text-gray-500">
                        {item.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subscribers Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                  총 구독자
                </h3>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {subscribersData.total}
                </div>
                <div className="text-sm text-gray-500 mb-6">
                  지난 달 대비 {subscribersData.growth}
                </div>

                {/* Subscriber Breakdown */}
                <div className="space-y-3">
                  {subscribersData.breakdown.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-600">
                          {item.type}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Views Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                  총 조회수
                </h3>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {viewsData.total}
                </div>
                <div className="text-sm text-gray-500">
                  지난 달 대비 {viewsData.growth}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default CreatorInsights
