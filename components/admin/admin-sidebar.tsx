"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BarChart3,
  Users,
  Settings,
  FileText,
  LayoutDashboard,
  Shield,
  CalendarDays,
  MessageSquare,
  BellRing,
  UserPlus,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function AdminSidebar() {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin",
      active: pathname === "/admin",
    },
    {
      label: "Users",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/users",
      active: pathname === "/admin/users",
    },
    {
      label: "User Management",
      icon: <UserPlus className="h-5 w-5" />,
      href: "/admin/users/manage",
      active: pathname === "/admin/users/manage",
    },
    {
      label: "Content",
      icon: <FileText className="h-5 w-5" />,
      href: "/admin/content",
      active: pathname === "/admin/content",
    },
    {
      label: "Reports",
      icon: <Shield className="h-5 w-5" />,
      href: "/admin/reports",
      active: pathname === "/admin/reports",
    },
    {
      label: "Analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/admin/analytics",
      active: pathname === "/admin/analytics",
    },
    {
      label: "Events",
      icon: <CalendarDays className="h-5 w-5" />,
      href: "/admin/events",
      active: pathname === "/admin/events",
    },
    {
      label: "Messages",
      icon: <MessageSquare className="h-5 w-5" />,
      href: "/admin/messages",
      active: pathname === "/admin/messages",
    },
    {
      label: "Notifications",
      icon: <BellRing className="h-5 w-5" />,
      href: "/admin/notifications",
      active: pathname === "/admin/notifications",
    },
    {
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/settings",
      active: pathname === "/admin/settings",
    },
  ]

  return (
    <div className="h-full border-r flex flex-col bg-white w-[240px] shadow-sm">
      <div className="p-6">
        <Link href="/admin">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-rose-500" />
            <span className="font-bold text-xl">Admin</span>
          </div>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-2 py-2">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={route.active ? "secondary" : "ghost"}
              size="sm"
              className={cn("w-full justify-start", route.active && "bg-rose-50 text-rose-700 hover:bg-rose-100")}
              asChild
            >
              <Link href={route.href}>
                {route.icon}
                <span className="ml-3">{route.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
            <span className="font-semibold text-rose-700">A</span>
          </div>
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-500">admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
