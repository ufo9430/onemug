import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import Sidebar from "@/components/Sidebar"
import axios from "@/lib/axios";

const getActiveItem = (pathname) => {
  if (pathname.startsWith("/feed")) return "feed"
  if (pathname.startsWith("/search")) return "search"
  if (pathname.startsWith("/messages")) return "messages"
  if (pathname.startsWith("/subscriptions")) return "subscriptions"
  if (pathname.startsWith("/notifications")) return "notifications"
  if (pathname.startsWith("/bookmarks")) return "bookmarks"
  if (pathname.startsWith("/recent")) return "recent"
  if (pathname.startsWith("/settings")) return "settings"
  return ""
}

const SidebarLayout = () => {


  console.log("SidebarLayout 렌더링");
  
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const activeItem = getActiveItem(pathname)
  const [sidebarProfile, setSidebarProfile] = useState({})

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
  // sidebarProfile에 fetchProfile 결과 입력
  useEffect(() => {
    fetchProfile()
      .then((data) => {
        setSidebarProfile(data)
      })
      .catch(() => {
        alert("로그인이 필요합니다.")
        navigate("/welcome")
      })
  }, [navigate])
  
  return (
    <div className="flex">
      <Sidebar profile={sidebarProfile} activeItem = {activeItem}/>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
export default SidebarLayout
