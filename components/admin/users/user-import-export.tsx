"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Download, Upload, FileSpreadsheet, File, AlertCircle, CheckCircle, Circle, Clock } from "lucide-react"

export function UserImportExport() {
  const { toast } = useToast()
  const [exportFormat, setExportFormat] = useState("csv")
  const [exportOptions, setExportOptions] = useState({
    includeProfileData: true,
    includeActivityData: true,
    includeVerificationData: true,
    includePreferences: true,
  })
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [importProgress, setImportProgress] = useState(0)
  const [importStatus, setImportStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [importResults, setImportResults] = useState<{
    total: number
    created: number
    updated: number
    skipped: number
    errors: string[]
  }>({
    total: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  })

  // Handle export file
  const handleExport = () => {
    toast({
      title: "Export started",
      description: `Exporting users to ${exportFormat.toUpperCase()} format.`,
    })

    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "User data has been exported successfully.",
      })
    }, 2000)
  }

  // Handle file upload for import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      // Reset import process
      setImportProgress(0)
      setImportStatus("idle")
      setImportResults({
        total: 0,
        created: 0,
        updated: 0,
        skipped: 0,
        errors: [],
      })
    }
  }

  // Handle import process
  const handleImport = () => {
    if (!uploadedFile) return

    setImportStatus("processing")

    // Simulate import process
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setImportProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setImportStatus("success")

        // Mock import results
        setImportResults({
          total: 120,
          created: 85,
          updated: 30,
          skipped: 5,
          errors: ["Row 23: Invalid email format", "Row 56: Missing required field 'first_name'"],
        })

        toast({
          title: "Import complete",
          description: "User data has been imported successfully with some warnings.",
        })
      }
    }, 500)
  }

  // Handle export option toggle
  const toggleExportOption = (option: keyof typeof exportOptions) => {
    setExportOptions({
      ...exportOptions,
      [option]: !exportOptions[option],
    })
  }

  // Get import status badge
  const getImportStatusBadge = () => {
    switch (importStatus) {
      case "processing":
        return (
          <div className="flex items-center text-amber-600">
            <Clock className="h-4 w-4 mr-1" />
            Processing
          </div>
        )
      case "success":
        return (
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            Completed
          </div>
        )
      case "error":
        return (
          <div className="flex items-center text-red-600">
            <AlertCircle className="h-4 w-4 mr-1" />
            Failed
          </div>
        )
      default:
        return (
          <div className="flex items-center text-gray-500">
            <Circle className="h-4 w-4 mr-1" />
            Ready
          </div>
        )
    }
  }

  return (
    <Tabs defaultValue="export" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="export">
          <Download className="h-4 w-4 mr-2" />
          Export Users
        </TabsTrigger>
        <TabsTrigger value="import">
          <Upload className="h-4 w-4 mr-2" />
          Import Users
        </TabsTrigger>
      </TabsList>

      <TabsContent value="export">
        <Card>
          <CardHeader>
            <CardTitle>Export User Data</CardTitle>
            <CardDescription>Export user data in various formats for backup or analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="export-format">Export Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger id="export-format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">
                    <div className="flex items-center">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      CSV (.csv)
                    </div>
                  </SelectItem>
                  <SelectItem value="json">
                    <div className="flex items-center">
                      <File className="h-4 w-4 mr-2" />
                      JSON (.json)
                    </div>
                  </SelectItem>
                  <SelectItem value="xlsx">
                    <div className="flex items-center">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Excel (.xlsx)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>Data to Include</Label>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="profile-data"
                    checked={exportOptions.includeProfileData}
                    onCheckedChange={() => toggleExportOption("includeProfileData")}
                  />
                  <label
                    htmlFor="profile-data"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Profile data (name, email, gender, etc.)
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="activity-data"
                    checked={exportOptions.includeActivityData}
                    onCheckedChange={() => toggleExportOption("includeActivityData")}
                  />
                  <label
                    htmlFor="activity-data"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Activity data (login history, actions)
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="verification-data"
                    checked={exportOptions.includeVerificationData}
                    onCheckedChange={() => toggleExportOption("includeVerificationData")}
                  />
                  <label
                    htmlFor="verification-data"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Verification data (status, documents)
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="preferences-data"
                    checked={exportOptions.includePreferences}
                    onCheckedChange={() => toggleExportOption("includePreferences")}
                  />
                  <label
                    htmlFor="preferences-data"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    User preferences and settings
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="export-users">Users to Export</Label>
              <Select defaultValue="all">
                <SelectTrigger id="export-users">
                  <SelectValue placeholder="Select users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="active">Active Users Only</SelectItem>
                  <SelectItem value="inactive">Inactive Users Only</SelectItem>
                  <SelectItem value="premium">Premium Subscribers Only</SelectItem>
                  <SelectItem value="recent">Recently Joined (Last 30 days)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleExport} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Export {Object.values(exportOptions).filter(Boolean).length} Data Fields
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="import">
        <Card>
          <CardHeader>
            <CardTitle>Import User Data</CardTitle>
            <CardDescription>Import users from a CSV or Excel file</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload File</Label>
              <div className="flex items-center">
                <Input id="file-upload" type="file" accept=".csv,.xlsx,.json" onChange={handleFileUpload} />
              </div>
              <p className="text-xs text-gray-500">
                Accepted formats: CSV, Excel (.xlsx), or JSON. Maximum file size: 10MB.
              </p>
            </div>

            {uploadedFile && (
              <div className="space-y-4">
                <div className="border rounded p-3 bg-gray-50">
                  <div className="flex items-center">
                    <FileSpreadsheet className="h-5 w-5 mr-2 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{uploadedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(uploadedFile.size / 1024).toFixed(2)} KB • Uploaded {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                    <div>{getImportStatusBadge()}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="import-mode">Import Mode</Label>
                  <Select defaultValue="create_update">
                    <SelectTrigger id="import-mode">
                      <SelectValue placeholder="Select import mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="create_update">Create new and update existing users</SelectItem>
                      <SelectItem value="create_only">Create new users only</SelectItem>
                      <SelectItem value="update_only">Update existing users only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="send-welcome" defaultChecked />
                    <label
                      htmlFor="send-welcome"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Send welcome email to new users
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="require-verification" defaultChecked />
                    <label
                      htmlFor="require-verification"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Require verification for new user accounts
                    </label>
                  </div>
                </div>

                {importStatus === "processing" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Importing users...</span>
                      <span>{importProgress}%</span>
                    </div>
                    <Progress value={importProgress} className="h-2" />
                  </div>
                )}

                {importStatus === "success" && (
                  <div className="border rounded-md p-4 bg-green-50">
                    <h4 className="font-medium text-green-700 flex items-center mb-2">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Import Completed Successfully
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p>Total records processed: {importResults.total}</p>
                      <p>Users created: {importResults.created}</p>
                      <p>Users updated: {importResults.updated}</p>
                      <p>Records skipped: {importResults.skipped}</p>
                    </div>
                    {importResults.errors.length > 0 && (
                      <div className="mt-3">
                        <p className="text-amber-700 font-medium text-sm">Warnings:</p>
                        <ul className="text-xs text-amber-700 list-disc pl-5 mt-1">
                          {importResults.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {!uploadedFile && (
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <h3 className="font-medium mb-1">Upload a file to get started</h3>
                <p className="text-sm text-gray-500 mb-4">Drag and drop a file here or click the upload button above</p>
                <p className="text-xs text-gray-400">
                  Need a template?{" "}
                  <a href="#" className="text-blue-500">
                    Download CSV template
                  </a>
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleImport}
              disabled={!uploadedFile || importStatus === "processing" || importStatus === "success"}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              {importStatus === "processing" ? "Importing..." : "Start Import"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
