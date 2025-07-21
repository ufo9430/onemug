import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import CreatorSidebar from "@/components/CreatorSidebar"

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
  const [sidebarProfile, setSidebarProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const { pathname } = useLocation()
  const activeItem = getActiveItem(pathname)

  useEffect(() => {
    fetch("http://localhost:8080/api/user/profile", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized")
        return res.json()
      })
      .then((data) => {
        if (!data.isCreator) {
          alert("창작자 계정이 아닙니다.")
          navigate("/feed")
        } else {
          setSidebarProfile(data)
        }
      })
      .catch(() => {
        alert("로그인이 필요합니다.")
        navigate("/welcome")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) return null

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
