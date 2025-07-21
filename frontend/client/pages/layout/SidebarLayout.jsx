import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import Sidebar from "@/components/Sidebar"

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

  useEffect(() => {
    fetch("http://localhost:8080/api/user/profile", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized")
        return res.json()
      })
      .then((data) => {
        console.log("User profile data:", data)
        setSidebarProfile(data)
      })
      .catch(() => {
        console.error("Failed to fetch user profile")
        navigate("/welcome")
      })
  }, [])
  
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
