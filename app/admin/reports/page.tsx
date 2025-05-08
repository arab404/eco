import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { AdminHeader } from "@/components/admin/admin-header"
import { ReportFilters } from "@/components/admin/reports/report-filters"
import { UserReports } from "@/components/admin/reports/user-reports"
import { ContentReports } from "@/components/admin/reports/content-reports"
import { PerformanceReports } from "@/components/admin/reports/performance-reports"
import { FinancialReports } from "@/components/admin/reports/financial-reports"
import { SavedReports } from "@/components/admin/reports/saved-reports"
import { ScheduledReports } from "@/components/admin/reports/scheduled-reports"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Reports"
        description="Generate and view detailed reports about platform activity and performance"
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="lg:w-64 p-4">
          <SavedReports />
          <div className="mt-6">
            <ScheduledReports />
          </div>
        </Card>

        <div className="flex-1">
          <ReportFilters />

          <Tabs defaultValue="users" className="mt-6">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="users">User Activity</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-4">
              <UserReports />
            </TabsContent>

            <TabsContent value="content" className="mt-4">
              <ContentReports />
            </TabsContent>

            <TabsContent value="performance" className="mt-4">
              <PerformanceReports />
            </TabsContent>

            <TabsContent value="financial" className="mt-4">
              <FinancialReports />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
