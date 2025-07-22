// App.jsx
import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import EmailStep from "./pages/register/EmailStep";
import PasswordStep from "./pages/register/PasswordStep";
import NicknameStep from "./pages/register/NicknameStep";
import Feed from "./pages/Feed";
import Explore from "./pages/Explore";
import PostDetail from "./pages/PostDetail";
import Messages from "./pages/Messages";
import Conversation from "./pages/Conversation";
import Notifications from "./pages/Notifications";
import Subscriptions from "./pages/Subscriptions";
import Bookmarks from "./pages/Bookmarks";
import Recent from "./pages/Recent";
import Settings from "./pages/Settings";
import CreatorSignup from "./pages/CreatorSignup";
import CreatorDashboard from "./pages/CreatorDashboard";
import CreatorPostDetail from "./pages/CreatorPostDetail";
import CreatorMembership from "./pages/CreatorMembership";
import CreatorInsights from "./pages/CreatorInsights";
import CreatePost from "./pages/CreatePost";
import CreatePostPublish from "./pages/CreatePostPublish";
import NotFound from "./pages/NotFound";
import Membership from "./pages/Membership";
import SidebarLayout from "./pages/layout/SidebarLayout";
import CreatorSidebarLayout from "./pages/layout/CreatorSidebarLayout";
import OAuthCallback from "./pages/OAuthCallback";
import ManageSubscribers from "./pages/ManageSubscribers";

const queryClient = new QueryClient();

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
          <Route path="/explore" element={<Explore />} />
          <Route path="/creator/signup" element={<CreatorSignup />} />
          {/* 일반 기능 레이아웃 */}
          <Route element={<SidebarLayout />}>
            <Route path="/feed" element={<Feed />} />
            <Route
              path="/feed/creator"
              element={<Feed hasCreatorAccount={true} />}
            />
            {/* 기존 search 라우트는 explore로 리다이렉트 */}
            <Route path="/search" element={<Navigate to="/explore" replace />} />
            <Route
              path="/Membership/creator/:creatorId"
              element={<Membership />}
            />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/recent" element={<Recent />} />
            <Route path="/messages" element={<Messages />} />
            <Route
              path="/messages/:conversationId"
              element={<Conversation />}
            />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/post/:id" element={<PostDetail />} />
          </Route>
          {/* 창작자 기능 레이아웃 */}
          <Route element={<CreatorSidebarLayout />}>
            <Route path="/creator/dashboard" element={<CreatorDashboard />} />
            <Route path="/creator/insights" element={<CreatorInsights />} />
            <Route path="/creator/messages" element={<Messages />} />
            <Route path="/creator/subscribers" element={<ManageSubscribers />} />
            <Route
              path="/creator/messages/:conversationId"
              element={<Conversation />}
            />
            <Route path="/creator/notifications" element={<Notifications />} />
            <Route path="/creator/settings" element={<Settings />} />
            <Route path="/creator/post/new" element={<CreatePost />} />
            <Route
              path="/creator/post/publish"
              element={<CreatePostPublish />}
            />
            <Route path="/creator/post/:id" element={<CreatorPostDetail />} />
            <Route path="/creator/membership" element={<CreatorMembership />} />
          </Route>
          <Route path="/oauth2/callback" element={<OAuthCallback />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
