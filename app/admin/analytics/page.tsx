import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EngagementOverview } from "@/components/admin/analytics/engagement-overview"
import { UserRetentionChart } from "@/components/admin/analytics/user-retention-chart"
import { FeatureUsageChart } from "@/components/admin/analytics/feature-usage-chart"
import { UserActivityHeatmap } from "@/components/admin/analytics/user-activity-heatmap"
import { MatchAnalytics } from "@/components/admin/analytics/match-analytics"
import { SubscriptionAnalytics } from "@/components/admin/analytics/subscription-analytics"
import { UserDemographics } from "@/components/admin/analytics/user-demographics"
import { DateRangePicker } from "@/components/admin/analytics/date-range-picker"
import { AnalyticsFilters } from "@/components/admin/analytics/analytics-filters"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <AdminHeader
          title="User Analytics"
          description="Detailed insights into user engagement and activity"
          className="mb-0"
        />
        <DateRangePicker />
      </div>

      <AnalyticsFilters />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="features">Feature Usage</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <EngagementOverview />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Users</CardTitle>
                <CardDescription>Daily, weekly, and monthly active users</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <UserRetentionChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feature Usage</CardTitle>
                <CardDescription>Most used features across the platform</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <FeatureUsageChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Activity Patterns</CardTitle>
              <CardDescription>Activity distribution by time of day and day of week</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <UserActivityHeatmap />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Session Metrics</CardTitle>
                <CardDescription>Average session duration and frequency</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <FeatureUsageChart chartType="session" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interaction Rate</CardTitle>
                <CardDescription>User interactions per active session</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <FeatureUsageChart chartType="interaction" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="retention" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Retention</CardTitle>
              <CardDescription>Cohort analysis of user retention over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <UserRetentionChart type="cohort" />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Churn Analysis</CardTitle>
                <CardDescription>User churn rate by segment</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <UserRetentionChart type="churn" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reactivation Rate</CardTitle>
                <CardDescription>Returning users after period of inactivity</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <UserRetentionChart type="reactivation" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="matches" className="space-y-4">
          <MatchAnalytics />
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Usage Breakdown</CardTitle>
              <CardDescription>Detailed analysis of feature usage across the platform</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <FeatureUsageChart chartType="detailed" />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Messaging</CardTitle>
                <CardDescription>Message volume and response rates</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px]">
                <FeatureUsageChart chartType="messaging" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profile Views</CardTitle>
                <CardDescription>Profile view metrics and conversion</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px]">
                <FeatureUsageChart chartType="profiles" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Virtual Events</CardTitle>
                <CardDescription>Event participation and engagement</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px]">
                <FeatureUsageChart chartType="events" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <SubscriptionAnalytics />
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <UserDemographics />
        </TabsContent>
      </Tabs>
    </div>
  )
}
