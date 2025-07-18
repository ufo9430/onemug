import "./global.css"

import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import Welcome from "./pages/Welcome"
import Login from "./pages/Login"
import EmailStep from "./pages/register/EmailStep"
import PasswordStep from "./pages/register/PasswordStep"
import NicknameStep from "./pages/register/NicknameStep"
import Feed from "./pages/Feed"
import Search from "./pages/Search"
import PostDetail from "./pages/PostDetail"
import Messages from "./pages/Messages"
import Conversation from "./pages/Conversation"
import Notifications from "./pages/Notifications"
import Subscriptions from "./pages/Subscriptions"
import Bookmarks from "./pages/Bookmarks"
import Recent from "./pages/Recent"
import Settings from "./pages/Settings"
import CreatorSignup from "./pages/CreatorSignup"
import CreatorDashboard from "./pages/CreatorDashboard"
import CreatorPostDetail from "./pages/CreatorPostDetail"
import CreatorMembership from "./pages/CreatorMembership"
import CreatorInsights from "./pages/CreatorInsights"
import CreatePost from "./pages/CreatePost"
import CreatePostPublish from "./pages/CreatePostPublish"
import NotFound from "./pages/NotFound"
import Membership from "./pages/Membership"

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/email" element={<EmailStep />} />
          <Route path="/register/password" element={<PasswordStep />} />
          <Route path="/register/nickname" element={<NicknameStep />} />
          <Route path="/feed" element={<Feed />} />
          <Route
            path="/feed/creator"
            element={<Feed hasCreatorAccount={true} />}
          />
          <Route path="/search" element={<Search />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:conversationId" element={<Conversation />} />
          <Route path="/Membership/creator/:creatorId" element={<Membership />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/recent" element={<Recent />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/creator/signup" element={<CreatorSignup />} />
          <Route path="/creator/dashboard" element={<CreatorDashboard />} />
          <Route path="/creator/insights" element={<CreatorInsights />} />
          <Route path="/creator/subscribers" element={<CreatorDashboard />} />
          <Route path="/creator/communication" element={<CreatorDashboard />} />
          <Route path="/creator/notifications" element={<CreatorDashboard />} />
          <Route path="/creator/settings" element={<CreatorDashboard />} />
          <Route path="/creator/post/new" element={<CreatePost />} />
          <Route path="/creator/post/publish" element={<CreatePostPublish />} />
          <Route path="/creator/post/:id" element={<CreatorPostDetail />} />
          <Route path="/creator/membership" element={<CreatorMembership />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
