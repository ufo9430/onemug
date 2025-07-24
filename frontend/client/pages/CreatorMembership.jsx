import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { X, Minus } from "lucide-react"
import axios from "@/lib/axios";
import { data } from "autoprefixer";

const AddMembershipModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [benefits, setBenefits] = useState([""])

  const addBenefit = () => {
    setBenefits([...benefits, ""])
  }

  const removeBenefit = index => {
    setBenefits(benefits.filter((_, i) => i !== index))
  }

  const updateBenefit = (index, value) => {
    const newBenefits = [...benefits]
    newBenefits[index] = value
    setBenefits(newBenefits)
  }

  const handleSave = () => {
    if (name && price) {
      axios.post("/c/membership/new", {
      name,
      price: parseInt(price),
      benefits: benefits.filter(b => b.trim())
    })
    .then(response => {
      console.log("멤버십 추가 성공:", response.data)
      onSave({
        id: response.data.id, // 서버에서 생성된 ID 사용
        name: response.data.name,
        price: response.data.price,
        benefits: response.data.benefits.filter(b => b.trim())
      })
      setName("")
      setPrice("")
      setBenefits([""])
      onClose()
    })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            새 멤버십 추가
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              멤버십 이름
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="멤버십 이름을 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              월 구독료 (원)
            </label>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            />
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              혜택
            </label>
            <div className="space-y-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={benefit}
                    onChange={e => updateBenefit(index, e.target.value)}
                    placeholder="혜택을 입력하세요"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  />
                  {benefits.length > 1 && (
                    <button
                      onClick={() => removeBenefit(index)}
                      className="w-9 h-9 flex items-center justify-center bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addBenefit}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 transition-colors text-sm"
              >
                + 혜택 추가
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={!name || !price}
            className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  )
}

const MembershipCard = ({ membership, onDelete }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 relative">

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {membership.name}
      </h3>

      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-2xl font-bold text-brand-primary">
          {membership.price.toLocaleString()}
        </span>
        <span className="text-2xl font-bold text-brand-primary">원</span>
        <span className="text-sm text-gray-500">/월</span>
      </div>

      <p className="text-gray-600 text-sm mb-4">{membership.description}</p>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">혜택</h4>
        <ul className="space-y-2">
          {membership.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <div className="w-1 h-1 bg-brand-primary rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => onDelete(membership.id)}
        className="w-full py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
      >
        삭제
      </button>
    </div>
  )
}

const CreatorMembership = () => {
  const navigate = useNavigate()
  const [showAddModal, setShowAddModal] = useState(false)
  const [memberships, setMemberships] = useState([])

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const response = await axios.get("/c/membership")
        console.log("멤버십 목록:", response.data)
        setMemberships(response.data)
      } catch (error) {
        console.error("멤버십 데이터를 불러오지 못했습니다:", error)
      }
    }
    fetchMemberships()
  }, [])

  const handleAddMembership = newMembership => {
    const membership = {
      ...newMembership,
      id: Date.now().toString()
    }
    setMemberships([...memberships, membership])
  }

  const handleDeleteMembership = id => {
    axios.delete(`/c/membership/delete?membershipId=${id}`)
      .then(() => {
        console.log("멤버십 삭제 성공")
      })
      .catch(err => {
        console.error("멤버십 삭제 실패", err)
      })
    // 로컬 상태에서도 삭제
    setMemberships(memberships.filter(m => m.id !== id))
  }

  return (
    <div className="min-h-screen bg-brand-secondary flex">

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="h-[73px] bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center">
            <div className="lg:hidden mr-4">
              <h2 className="text-lg font-bold text-gray-900">OneMug</h2>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">대시보드</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors"
          >
            멤버십 추가
          </button>
        </header>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 px-6">
          <div className="flex gap-1">
            <button
              onClick={() => navigate("/creator/dashboard")}
              className="bg-gray-50 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              홈
            </button>
            <button className="bg-brand-primary text-white px-3 py-2 rounded-lg text-sm font-medium">
              멤버십
            </button>
          </div>
        </div>

        {/* Content Area */}
        <main className="bg-brand-secondary min-h-[calc(100vh-73px-57px)] p-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {memberships.map(membership => (
                <MembershipCard
                  key={membership.id}
                  membership={membership}
                  onDelete={handleDeleteMembership}
                />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Add Membership Modal */}
      <AddMembershipModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddMembership}
      />
    </div>
  )
}

export default CreatorMembership
