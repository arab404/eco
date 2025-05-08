import type { ReactNode } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  )
}
