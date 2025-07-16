import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import CreatorSidebar from "../components/CreatorSidebar";

export default function CreatorInsights() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [membershipData, setMembershipData] = useState({
    total: "2,847,000원",
    growth: "+12.5%",
    chartData: [
      { month: "10월", height: 31 },
      { month: "11월", height: 35 },
      { month: "12월", height: 38 },
    ],
  });
  const [subscribersData, setSubscribersData] = useState({
    total: "1,247명",
    growth: "+8.3%",
    breakdown: [
      { type: "베이직", count: "847명", color: "#F3F4F6" },
      { type: "프리미엄", count: "324명", color: "#E5E7EB" },
      { type: "VIP", count: "76명", color: "#591600" },
    ],
  });
  const [viewsData, setViewsData] = useState({
    total: "28,533",
    growth: "+15.7%",
  });

  const periods = [
    { value: "7", label: "7일" },
    { value: "30", label: "30일" },
    { value: "90", label: "90일" },
  ];

  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  useEffect(() => {
    // API call to fetch data based on selected period
    // For demonstration purposes, we'll just update the data directly
    if (selectedPeriod === "7") {
      setMembershipData({
        total: "1,847,000원",
        growth: "+5.5%",
        chartData: [
          { month: "10월", height: 21 },
          { month: "11월", height: 25 },
          { month: "12월", height: 28 },
        ],
      });
      setSubscribersData({
        total: "847명",
        growth: "+3.3%",
        breakdown: [
          { type: "베이직", count: "547명", color: "#F3F4F6" },
          { type: "프리미엄", count: "224명", color: "#E5E7EB" },
          { type: "VIP", count: "76명", color: "#591600" },
        ],
      });
      setViewsData({
        total: "18,533",
        growth: "+10.7%",
      });
    } else if (selectedPeriod === "90") {
      setMembershipData({
        total: "4,847,000원",
        growth: "+20.5%",
        chartData: [
          { month: "10월", height: 41 },
          { month: "11월", height: 45 },
          { month: "12월", height: 48 },
        ],
      });
      setSubscribersData({
        total: "2,247명",
        growth: "+13.3%",
        breakdown: [
          { type: "베이직", count: "1,247명", color: "#F3F4F6" },
          { type: "프리미엄", count: "624명", color: "#E5E7EB" },
          { type: "VIP", count: "376명", color: "#591600" },
        ],
      });
      setViewsData({
        total: "38,533",
        growth: "+25.7%",
      });
    }
  }, [selectedPeriod]);

  return (
    <div className="min-h-screen bg-brand-secondary flex">
      <CreatorSidebar activeItem="insights" />
      <div className="flex-1">
        <div className="px-4 py-6">
          <h2 className="text-2xl font-bold mb-4">크리에이터 인사이트</h2>
          <div className="flex justify-between mb-4">
            <div className="flex items-center">
              <BarChart3 className="w-6 h-6 mr-2" />
              <span className="text-lg font-bold">멤버십</span>
            </div>
            <select
              value={selectedPeriod}
              onChange={handlePeriodChange}
              className="bg-brand-secondary border border-brand-primary text-brand-primary px-2 py-1 rounded"
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow-md">
              <h3 className="text-lg font-bold mb-2">멤버십</h3>
              <p className="text-3xl font-bold mb-2">{membershipData.total}</p>
              <p className="text-lg text-gray-500">{membershipData.growth}</p>
              <div className="mt-4">
                <canvas id="membershipChart" width="200" height="100"></canvas>
              </div>
            </div>
            <div className="bg-white p-4 rounded shadow-md">
              <h3 className="text-lg font-bold mb-2">구독자</h3>
              <p className="text-3xl font-bold mb-2">{subscribersData.total}</p>
              <p className="text-lg text-gray-500">{subscribersData.growth}</p>
              <div className="mt-4">
                <div className="flex flex-wrap justify-center">
                  {subscribersData.breakdown.map((subscriber) => (
                    <div
                      key={subscriber.type}
                      className="w-1/2 md:w-1/3 lg:w-1/4 p-2"
                    >
                      <div
                        className="bg-white p-2 rounded shadow-md"
                        style={{ backgroundColor: subscriber.color }}
                      >
                        <p className="text-lg font-bold mb-1">{subscriber.type}</p>
                        <p className="text-lg">{subscriber.count}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded shadow-md">
              <h3 className="text-lg font-bold mb-2">조회수</h3>
              <p className="text-3xl font-bold mb-2">{viewsData.total}</p>
              <p className="text-lg text-gray-500">{viewsData.growth}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
