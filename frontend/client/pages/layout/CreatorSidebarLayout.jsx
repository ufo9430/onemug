import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import CreatorSidebar from "@/components/CreatorSidebar"
import axios from "@/lib/axios";

const getActiveItem = (pathname) => {
  if (pathname.startsWith("/creator/dashboard")) return "dashboard"
  if (pathname.startsWith("/creator/insights")) return "insights"
  if (pathname.startsWith("/creator/subscribers")) return "subscribers"
  if (pathname.startsWith("/creator/messages")) return "messages"
  if (pathname.startsWith("/creator/notifications")) return "notifications"
  if (pathname.startsWith("/creator/settings")) return "settings"
  return ""
}

const CreatorSidebarLayout = () => {
  const navigate = useNavigate()
  const [sidebarProfile, setSidebarProfile] = useState({})
  const { pathname } = useLocation()
  const activeItem = getActiveItem(pathname)

  const fetchProfile = async () => {
    try {
      const response = await axios.get("/api/user/profile", {
      })
      return response.data
    } catch (error) {
      console.error("Failed to fetch profile:", error)
      throw error
    }
  }

  useEffect(() => {
    fetchProfile()
      .then((data) => {
        console.log("사이드바 프로필 데이터:", data)
        if (!data.isCreator) {
          alert("창작자 계정이 아닙니다.")
          navigate("/feed")
        } else {
          setSidebarProfile(data)
        }})
        .catch(() => {
          alert("로그인이 필요합니다.")
          navigate("/welcome")
      })
  }, [navigate])

  return (
    <div className="flex">
      <CreatorSidebar profile={sidebarProfile} activeItem = {activeItem}/>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
export default CreatorSidebarLayout
