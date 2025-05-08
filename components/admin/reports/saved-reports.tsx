"use client"

import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

export function SavedReports() {
  // Mock saved reports data
  const savedReports = [
    { id: 1, name: "Monthly User Activity", date: "June 2023" },
    { id: 2, name: "Quarterly Revenue", date: "Q2 2023" },
    { id: 3, name: "Content Moderation Summary", date: "May 2023" },
    { id: 4, name: "User Conversion Analysis", date: "June 2023" },
  ]

  return (
    <div>
      <h3 className="text-sm font-medium mb-3">Saved Reports</h3>
      <div className="space-y-2">
        {savedReports.map((report) => (
          <Button key={report.id} variant="outline" className="w-full justify-start text-left h-auto py-2">
            <FileText className="mr-2 h-4 w-4" />
            <div className="flex flex-col items-start">
              <span className="text-sm">{report.name}</span>
              <span className="text-xs text-muted-foreground">{report.date}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}
