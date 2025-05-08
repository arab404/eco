import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReportsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="lg:w-64 p-4">
          <Skeleton className="h-5 w-28 mb-3" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>

          <Skeleton className="h-5 w-32 mt-6 mb-3" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </Card>

        <div className="flex-1">
          <Card className="p-4">
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-32" />
            </div>
          </Card>

          <Tabs defaultValue="users" className="mt-6">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="users">User Activity</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-4">
              <Card className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-[300px] w-full rounded-md" />
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
