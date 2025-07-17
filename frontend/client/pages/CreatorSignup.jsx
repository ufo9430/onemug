import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Camera } from "lucide-react"

const CreatorSignup = () => {
  const navigate = useNavigate()
  const [introduction, setIntroduction] = useState("")
  const [profileImage, setProfileImage] = useState(null)

  const handleImageUpload = e => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = e => {
        setProfileImage(e.target?.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (introduction.trim()) {
      // Handle creator account creation
      console.log("Creating creator account:", { introduction, profileImage })
      // Navigate to creator dashboard
      navigate("/creator/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-brand-secondary flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg w-full max-w-lg">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              창작자 계정 생성
            </h1>
            <p className="text-gray-600">독자들과 소통을 시작해보세요</p>
          </div>

          {/* Profile Image Upload */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-36 h-36 rounded-full border-2 border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <label
                htmlFor="profile-upload"
                className="absolute inset-0 rounded-full cursor-pointer hover:bg-black hover:bg-opacity-10 transition-colors flex items-center justify-center"
              >
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">프로필 사진</p>
          </div>

          {/* Introduction Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                독자들에게 자신을 소개해 보세요
              </label>
              <textarea
                value={introduction}
                onChange={e => setIntroduction(e.target.value)}
                placeholder="자기소개를 입력해주세요..."
                className="w-full h-12 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent text-sm"
                maxLength={30}
              />
              <div className="flex justify-end mt-2">
                <span className="text-sm text-gray-500">
                  {introduction.length}/30
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!introduction.trim()}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                introduction.trim()
                  ? "bg-brand-primary text-white hover:bg-brand-primary/90"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              창작 시작하기
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreatorSignup
