import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Minus } from "lucide-react";
import CreatorSidebar from "../components/CreatorSidebar";

const AddMembershipModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [benefits, setBenefits] = useState([""]);

  const addBenefit = () => {
    setBenefits([...benefits, ""]);
  };

  const removeBenefit = (index) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const updateBenefit = (index, value) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    setBenefits(newBenefits);
  };

  const handleSave = () => {
    if (name && price) {
      onSave({
        name,
        price: parseInt(price),
        description,
        benefits: benefits.filter((b) => b.trim()),
      });
      setName("");
      setPrice("");
      setDescription("");
      setBenefits([""]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">새 멤버십 추가</h2>
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
            <label className="block text-sm font-semibold text-gray-900 mb-2">멤버십 이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="멤버십 이름을 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            />
          </div>
          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">월 구독료 (원)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="월 구독료를 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            />
          </div>
          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="멤버십 설명을 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            />
          </div>
          {/* Benefits */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">혜택</label>
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center mb-2">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => updateBenefit(idx, e.target.value)}
                  placeholder="혜택을 입력하세요"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
                {benefits.length > 1 && (
                  <button
                    onClick={() => removeBenefit(idx)}
                    className="ml-2 p-1 rounded bg-gray-100 hover:bg-gray-200"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addBenefit}
              className="mt-2 px-3 py-1 bg-brand-primary text-white rounded hover:bg-brand-primary-dark"
            >
              혜택 추가
            </button>
          </div>
        </div>
        {/* Actions */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-lg bg-brand-primary text-white font-medium hover:bg-opacity-90 transition-colors"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default function CreatorMembership() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [tiers, setTiers] = useState([
    {
      id: "1",
      name: "베이직",
      price: 3000,
      description: "기본 멤버십 혜택 제공",
      benefits: ["월 1회 전용 콘텐츠"],
      isPopular: false,
    },
    {
      id: "2",
      name: "프리미엄",
      price: 7000,
      description: "프리미엄 혜택 제공",
      benefits: ["월 4회 전용 콘텐츠", "Q&A 참여"],
      isPopular: true,
    },
  ]);

  const handleAddTier = (tier) => {
    setTiers([
      ...tiers,
      {
        ...tier,
        id: String(Date.now()),
        isPopular: false,
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-brand-secondary flex">
      <CreatorSidebar activeItem="membership" />
      <div className="flex-1">
        <header className="h-[73px] bg-white border-b border-gray-200 flex items-center px-6">
          <div className="lg:hidden mr-4">
            <h2 className="text-lg font-bold text-gray-900">OneMug</h2>
          </div>
          <h1 className="text-xl font-bold text-gray-900">멤버십 관리</h1>
          <button
            className="ml-auto px-6 py-3 rounded-lg bg-brand-primary text-white font-medium hover:bg-opacity-90 transition-colors"
            onClick={() => setModalOpen(true)}
          >
            새 멤버십 추가
          </button>
        </header>
        <main className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div key={tier.id} className={`bg-white rounded-xl border border-gray-200 shadow-sm p-6 ${tier.isPopular ? "border-brand-primary" : ""}`}>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-gray-900">{tier.name}</h2>
                  {tier.isPopular && <span className="ml-2 px-2 py-1 bg-brand-primary text-white rounded text-xs">인기</span>}
                </div>
                <div className="text-2xl font-bold text-brand-primary mb-2">₩{tier.price.toLocaleString()}</div>
                <div className="text-gray-700 mb-2">{tier.description}</div>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  {tier.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </main>
        <AddMembershipModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleAddTier}
        />
      </div>
    </div>
  );
}
