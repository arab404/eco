"use client"

import { useState } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserBulkActions } from "@/components/admin/users/user-bulk-actions"
import { UserFilters } from "@/components/admin/users/user-filters"
import { UserManagementTable } from "@/components/admin/users/user-management-table"
import { UserImportExport } from "@/components/admin/users/user-import-export"
import { UserRoleManagement } from "@/components/admin/users/user-role-management"
import { UserVerificationQueue } from "@/components/admin/users/user-verification-queue"

export default function UserManagementPage() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [currentTab, setCurrentTab] = useState("all-users")

  return (
    <div className="space-y-6">
      <AdminHeader title="User Management" description="Advanced tools for managing users across the platform" />

      <Card className="p-6">
        <Tabs defaultValue="all-users" value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <TabsList className="flex-wrap">
              <TabsTrigger value="all-users">All Users</TabsTrigger>
              <TabsTrigger value="verification">Verification Queue</TabsTrigger>
              <TabsTrigger value="roles">Role Management</TabsTrigger>
              <TabsTrigger value="import-export">Import/Export</TabsTrigger>
            </TabsList>
          </div>

          {selectedUsers.length > 0 && currentTab === "all-users" && (
            <UserBulkActions selectedUsers={selectedUsers} onClearSelection={() => setSelectedUsers([])} />
          )}

          <TabsContent value="all-users" className="space-y-4">
            <UserFilters />
            <UserManagementTable selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
          </TabsContent>

          <TabsContent value="verification">
            <UserVerificationQueue />
          </TabsContent>

          <TabsContent value="roles">
            <UserRoleManagement />
          </TabsContent>

          <TabsContent value="import-export">
            <UserImportExport />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
