import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import CreatorSidebar from "../components/CreatorSidebar"
import { set } from "date-fns"

function formatLocalDateTimeToShortDate(dateTimeString) {
  const date = new Date(dateTimeString);
  const year = date.getFullYear().toString().slice(2); // "25"
  const month = String(date.getMonth() + 1).padStart(2, '0'); // "07"
  const day = String(date.getDate()).padStart(2, '0'); // "21"
  return `${year}.${month}.${day}`;
}

const CreatorInsights = () => {
  const navigate = useNavigate()
  const [selectedPeriod, setSelectedPeriod] = useState("30")
  const [membershipData, setMembershipData] = useState({
    total: "2,847,000원"
  })
  const [subscribersData, setSubscribersData] = useState({
    total: "1,247명",
    breakdown: [
      { type: "베이직", count: "847명", color: "#F3F4F6" },
      { type: "프리미엄", count: "324명", color: "#E5E7EB" },
      { type: "VIP", count: "76명", color: "#591600" }
    ]
  })
  const [viewsData, setViewsData] = useState({
    total: "28,533",
    chartData: [
      { time: "10월", value: 31 }, // pastPastIncome 차트 데이터에 맞춰
      { time: "11월", value: 35 }, // pastIncome
      { time: "12월", value: 38 } // currentIncome
    ]
  })

  useEffect(() => {
    fetch(`http://localhost:8080/c/insight?days=${selectedPeriod}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      return response.json()
    }).then(data => {
      console.log("받은 데이터",data)
      // 여기에 받은 데이터를 상태로 설정하거나 필요한 작업을 수행
      setMembershipData({
        total: data.incomes.total
      })
      setSubscribersData({
        total: data.totalSubscribers,
        breakdown: Object.entries(data.subscribers).map(([type, count]) => {
          let color = "#591600"
          return { type, count: `${count}명`, color }
        })
      })
      setViewsData({
        total: data.currentViews,
        chartData: data.views_chartData
      })
    })
  }, [selectedPeriod])
  
  // Mock data for insights
  //   {
  //   "currentIncome": 0,
  //   "pastIncome": 0,
  //   "pastPastIncome": 0,아이거
  //   "currentViews": 7
  //   "pastViews": 17,
  //   "currentSubscribers": {},
  // }

  const periods = [
    { value: "7", label: "7일" },
    { value: "30", label: "30일" },
    { value: "365", label: "1년" }]

  // 막대그래프 chartData 처리
  const chartBarMaxHeight = 200 // px, 가장 높은 막대의 높이
  const chartData = viewsData.chartData
  const maxValue = Math.max(...chartData.map(item => item.value))
  const normalizedChartData = chartData.map(item => ({
    ...item,
    barHeight: Math.round((item.value / maxValue) * chartBarMaxHeight)
  }))

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

            {/* Metrics Cards - vertical layout */}
            <div className="flex flex-col gap-6">
              {/* Membership Income Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                  총 멤버십 수입
                </h3>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {membershipData.total+"원"}
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  기간 : {selectedPeriod} 일
                </div>
              </div>

              {/* Subscribers Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                  총 구독자
                </h3>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {subscribersData.total+"명"}
                </div>
                <div className="text-sm text-gray-500 mb-6">
                  기간 : {selectedPeriod} 일
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
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  총 조회수
                </h3>
                <div className="text-sm text-gray-500 mb-2">
                  단위 기간 : {selectedPeriod} 일
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {viewsData.total}
                </div>
                {/* Mini Bar Chart */}
                <div className="bg-gray-50 rounded-lg mt-3 p-4 h-64 flex items-end justify-between gap-8">
                  {normalizedChartData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <span className="text-xs text-gray-500">
                        {item.value}
                      </span>
                      <div
                        className="w-4 bg-brand-primary rounded-sm mb-1"
                        style={{ height: `${item.barHeight}px` }}
                      />
                      <span className="text-xs text-gray-500">
                        {formatLocalDateTimeToShortDate(item.time)}
                      </span>
                    </div>
                  ))}
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
