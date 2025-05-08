"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Check, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"

const generalSettingsSchema = z.object({
  // App Information
  appName: z.string().min(2, { message: "App name must be at least 2 characters." }),
  appDescription: z.string().min(10, { message: "Description must be at least 10 characters." }),
  supportEmail: z.string().email({ message: "Please enter a valid email address." }),
  supportPhone: z.string().optional(),
  companyName: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  companyAddress: z.string().min(5, { message: "Company address must be at least 5 characters." }),

  // App Configuration
  maxDistance: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Must be a valid positive number.",
  }),
  defaultLanguage: z.string(),
  dateFormat: z.string(),
  timeFormat: z.string(),
  timezone: z.string(),

  // Features
  enableLocationServices: z.boolean(),
  enablePushNotifications: z.boolean(),
  enableVideoChat: z.boolean(),
  enableVoiceChat: z.boolean(),
  enableGifMessages: z.boolean(),
  enableReadReceipts: z.boolean(),
  enableTypingIndicators: z.boolean(),
  enableUserVerification: z.boolean(),

  // App Store
  appStoreUrl: z.string().url().optional().or(z.literal("")),
  playStoreUrl: z.string().url().optional().or(z.literal("")),
  websiteUrl: z.string().url().optional().or(z.literal("")),

  // System
  maintenanceMode: z.boolean(),
  maintenanceMessage: z.string().min(10, { message: "Message must be at least 10 characters." }).optional(),
  userRegistration: z.enum(["open", "invite", "closed"]),
  maxUploadSize: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Must be a valid positive number.",
  }),

  // Analytics
  googleAnalyticsId: z.string().optional(),
  facebookPixelId: z.string().optional(),
  mixpanelToken: z.string().optional(),
  hotjarId: z.string().optional(),
})

type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>

export default function GeneralSettings() {
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const defaultValues: GeneralSettingsValues = {
    // App Information
    appName: "LoveMatch",
    appDescription:
      "A modern dating app that connects people based on shared interests, values, and compatibility. Our advanced matching algorithm helps you find meaningful relationships.",
    supportEmail: "support@lovematch.com",
    supportPhone: "+1 (800) 555-1234",
    companyName: "LoveMatch Technologies, Inc.",
    companyAddress: "123 Dating Street, San Francisco, CA 94105, USA",

    // App Configuration
    maxDistance: "100",
    defaultLanguage: "en",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    timezone: "America/New_York",

    // Features
    enableLocationServices: true,
    enablePushNotifications: true,
    enableVideoChat: true,
    enableVoiceChat: true,
    enableGifMessages: true,
    enableReadReceipts: true,
    enableTypingIndicators: true,
    enableUserVerification: true,

    // App Store
    appStoreUrl: "https://apps.apple.com/us/app/lovematch-dating/id1234567890",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.lovematch.dating",
    websiteUrl: "https://lovematch.com",

    // System
    maintenanceMode: false,
    maintenanceMessage:
      "We're currently performing scheduled maintenance to improve your experience. Please check back in a few hours.",
    userRegistration: "open",
    maxUploadSize: "10",

    // Analytics
    googleAnalyticsId: "G-ABC123DEF4",
    facebookPixelId: "987654321098765",
    mixpanelToken: "abcdef123456",
    hotjarId: "2345678",
  }

  const form = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues,
    mode: "onChange",
  })

  function onSubmit(data: GeneralSettingsValues) {
    setIsSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    // Simulate API call
    setTimeout(() => {
      try {
        // Simulate random error (10% chance)
        if (Math.random() < 0.1) {
          throw new Error("Network error: Could not connect to server. Please try again.")
        }

        console.log("Saving settings:", data)
        setIsSaving(false)
        setSaveSuccess(true)

        toast({
          title: "Settings updated",
          description: "Your general settings have been saved successfully.",
        })

        // Reset success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000)
      } catch (error) {
        setIsSaving(false)
        setSaveError(error instanceof Error ? error.message : "An unknown error occurred")

        toast({
          variant: "destructive",
          title: "Error saving settings",
          description: error instanceof Error ? error.message : "An unknown error occurred",
        })
      }
    }, 1500)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="app-info" className="w-full">
          <TabsList className="grid grid-cols-5 w-full max-w-3xl">
            <TabsTrigger value="app-info">App Info</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="app-info" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Configure your app's basic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="appName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>App Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>The name of your dating application as it appears to users.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="appDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>App Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} placeholder="Enter a brief description of your dating app" />
                      </FormControl>
                      <FormDescription>A short description used in metadata and app stores.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="supportEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Support Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormDescription>Email address for user support inquiries.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="supportPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Support Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>Phone number for user support inquiries.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Legal information about your company</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Legal name of your company.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Address</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={2} />
                      </FormControl>
                      <FormDescription>Legal address of your company.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuration" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>App Configuration</CardTitle>
                <CardDescription>Configure basic app settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="maxDistance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Distance (km)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="1" max="500" />
                        </FormControl>
                        <FormDescription>Maximum distance for matching users.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="defaultLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Language</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="zh">Chinese</SelectItem>
                            <SelectItem value="ja">Japanese</SelectItem>
                            <SelectItem value="ko">Korean</SelectItem>
                            <SelectItem value="ar">Arabic</SelectItem>
                            <SelectItem value="hi">Hindi</SelectItem>
                            <SelectItem value="pt">Portuguese</SelectItem>
                            <SelectItem value="ru">Russian</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Default language for new users.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="dateFormat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Format</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select date format" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Default date format.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeFormat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Format</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time format" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                            <SelectItem value="24h">24-hour</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Default time format.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Timezone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                            <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                            <SelectItem value="Europe/London">London (GMT)</SelectItem>
                            <SelectItem value="Europe/Paris">Central European (CET)</SelectItem>
                            <SelectItem value="Asia/Tokyo">Japan (JST)</SelectItem>
                            <SelectItem value="Australia/Sydney">Sydney (AEST)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Default timezone for dates and times.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <FormField
                  control={form.control}
                  name="userRegistration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Registration</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="open" />
                            </FormControl>
                            <FormLabel className="font-normal">Open (anyone can register)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="invite" />
                            </FormControl>
                            <FormLabel className="font-normal">Invite Only (requires invitation code)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="closed" />
                            </FormControl>
                            <FormLabel className="font-normal">Closed (registration disabled)</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormDescription>Control how new users can register for your app</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxUploadSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Upload Size (MB)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="1" max="100" />
                      </FormControl>
                      <FormDescription>Maximum file size for user uploads (profile photos, messages).</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Mode</CardTitle>
                <CardDescription>Configure maintenance settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="maintenanceMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-amber-50">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Maintenance Mode</FormLabel>
                        <FormDescription>When enabled, only admins can access the application.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("maintenanceMode") && (
                  <FormField
                    control={form.control}
                    name="maintenanceMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maintenance Message</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} />
                        </FormControl>
                        <FormDescription>Message to display to users during maintenance.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Feature Configuration</CardTitle>
                <CardDescription>Enable or disable app features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="enableLocationServices"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Location Services</FormLabel>
                          <FormDescription>Enable location-based matching and features.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enablePushNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Push Notifications</FormLabel>
                          <FormDescription>Enable push notifications for all users.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enableVideoChat"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Video Chat</FormLabel>
                          <FormDescription>Allow users to have video calls.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enableVoiceChat"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Voice Chat</FormLabel>
                          <FormDescription>Allow users to have voice calls.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enableGifMessages"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>GIF Messages</FormLabel>
                          <FormDescription>Allow users to send GIFs in messages.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enableReadReceipts"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Read Receipts</FormLabel>
                          <FormDescription>Show when messages have been read.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enableTypingIndicators"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Typing Indicators</FormLabel>
                          <FormDescription>Show when users are typing messages.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enableUserVerification"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>User Verification</FormLabel>
                          <FormDescription>Enable identity verification for users.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>App Distribution</CardTitle>
                <CardDescription>Configure app store and website links</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="appStoreUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>App Store URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://apps.apple.com/..." />
                      </FormControl>
                      <FormDescription>Link to your iOS app on the App Store.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="playStoreUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Google Play Store URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://play.google.com/store/apps/..." />
                      </FormControl>
                      <FormDescription>Link to your Android app on the Play Store.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="websiteUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://yourdatingapp.com" />
                      </FormControl>
                      <FormDescription>Link to your app's marketing website.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Tracking</CardTitle>
                <CardDescription>Configure analytics and tracking services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="googleAnalyticsId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Google Analytics ID</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="G-XXXXXXXXXX" />
                        </FormControl>
                        <FormDescription>Your Google Analytics 4 measurement ID.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="facebookPixelId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook Pixel ID</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="XXXXXXXXXX" />
                        </FormControl>
                        <FormDescription>Your Facebook Pixel ID for conversion tracking.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="mixpanelToken"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mixpanel Token</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="xxxxxxxxxxxxxxxxxxxxxxxx" />
                        </FormControl>
                        <FormDescription>Your Mixpanel project token for user analytics.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hotjarId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hotjar ID</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="XXXXXXX" />
                        </FormControl>
                        <FormDescription>Your Hotjar site ID for user behavior tracking.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {saveError && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{saveError}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-end space-x-4 mt-6">
          <Button variant="outline" type="button">
            Reset Changes
          </Button>
          <Button type="submit" disabled={isSaving} className="min-w-[120px]">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Saved
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
