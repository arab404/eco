import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminDashboardStats } from "@/components/admin/admin-dashboard-stats"
import { AdminRecentActivity } from "@/components/admin/admin-recent-activity"
import { AdminVerificationQueue } from "@/components/admin/admin-verification-queue"
import { AdminReportedContent } from "@/components/admin/admin-reported-content"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <AdminHeader title="Dashboard" description="Overview of your dating platform" />

      <AdminDashboardStats />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Verification Queue</CardTitle>
            <CardDescription>Users awaiting verification approval</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminVerificationQueue />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reported Content</CardTitle>
            <CardDescription>Recently reported content that needs review</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminReportedContent />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminRecentActivity />
        </CardContent>
      </Card>
    </div>
  )
}
