"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Clock } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ScheduledReports() {
  // Mock scheduled reports data
  const scheduledReports = [
    { id: 1, name: "Weekly User Activity", schedule: "Every Monday", next: "Jul 8, 2023" },
    { id: 2, name: "Monthly Revenue Report", schedule: "1st of month", next: "Jul 1, 2023" },
    { id: 3, name: "Content Moderation", schedule: "Every Friday", next: "Jul 5, 2023" },
  ]

  return (
    <div>
      <h3 className="text-sm font-medium mb-3">Scheduled Reports</h3>
      <div className="space-y-2">
        <TooltipProvider>
          {scheduledReports.map((report) => (
            <Tooltip key={report.id}>
              <TooltipTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left h-auto py-2">
                  <Calendar className="mr-2 h-4 w-4" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm">{report.name}</span>
                    <span className="text-xs text-muted-foreground">Next: {report.next}</span>
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Schedule: {report.schedule}</span>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  )
}
