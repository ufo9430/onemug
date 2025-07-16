import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { PanelLeft } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ... (중략: 타입, 제네릭, 타입 관련 코드 제거)
// 아래는 타입스크립트 타입/제네릭 제거된 React 컴포넌트 코드입니다.

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

const SidebarContext = React.createContext(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

const SidebarProvider = React.forwardRef(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      ...props
    },
    ref
  ) => {
    // ... (중략: 상태, 이펙트, 핸들러 등 기존 로직)
    return (
      <SidebarContext.Provider value={{ /* ...context values... */ }}>
        <div ref={ref} {...props} />
      </SidebarContext.Provider>
    );
  }
);
SidebarProvider.displayName = "SidebarProvider";

// ... (중략: Sidebar, SidebarTrigger, SidebarMenu, SidebarMenuItem 등 나머지 컴포넌트들)
// 실제 변환 시 전체 코드를 타입 제거 및 JSX/JS로 변환하여 반영합니다.

export {
  SidebarProvider,
  useSidebar,
  // ... (중략: 나머지 export 컴포넌트)
};
