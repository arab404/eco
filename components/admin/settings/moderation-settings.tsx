"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Info, Shield } from "lucide-react"

const moderationFormSchema = z.object({
  contentFilterLevel: z.string(),
  autoModeration: z.boolean(),
  profanityFilter: z.boolean(),
  imageModeration: z.boolean(),
  sensitivityThreshold: z.array(z.number()),
  reportThreshold: z.string(),
  bannedWords: z.string(),
  appealProcess: z.boolean(),
  appealEmail: z.string().email().optional(),
  moderationTeamSize: z.string(),
  aiModeration: z.boolean(),
})

export default function ModerationSettings() {
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<z.infer<typeof moderationFormSchema>>({
    resolver: zodResolver(moderationFormSchema),
    defaultValues: {
      contentFilterLevel: "medium",
      autoModeration: true,
      profanityFilter: true,
      imageModeration: true,
      sensitivityThreshold: [65],
      reportThreshold: "3",
      bannedWords: "offensive, slur, inappropriate",
      appealProcess: true,
      appealEmail: "appeals@datingapp.com",
      moderationTeamSize: "5",
      aiModeration: true,
    },
  })

  function onSubmit(values: z.infer<typeof moderationFormSchema>) {
    setIsSaving(true)
    console.log(values)
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Moderation Settings</h3>
        <p className="text-sm text-muted-foreground">Configure how content is moderated across your dating platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Filtering</CardTitle>
            <CardDescription>Configure automatic content filtering settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="contentFilterLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Filter Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select filter level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">
                            <div className="flex items-center gap-2">
                              <Info className="h-4 w-4 text-blue-500" />
                              <span>Low - Block explicit content only</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="medium">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                              <span>Medium - Block explicit and suggestive content</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="high">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-red-500" />
                              <span>High - Strict content filtering</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Choose how strictly content should be filtered</FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="autoModeration"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Automatic Moderation</FormLabel>
                        <FormDescription>Automatically moderate content using AI</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profanityFilter"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Profanity Filter</FormLabel>
                        <FormDescription>Filter out profanity in messages and profiles</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageModeration"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Image Moderation</FormLabel>
                        <FormDescription>Automatically scan and filter inappropriate images</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sensitivityThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sensitivity Threshold ({field.value}%)</FormLabel>
                      <FormControl>
                        <Slider defaultValue={field.value} max={100} step={1} onValueChange={field.onChange} />
                      </FormControl>
                      <FormDescription>Adjust how sensitive the content filters should be</FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bannedWords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banned Words/Phrases</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter comma-separated words or phrases"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Words or phrases that will be automatically filtered</FormDescription>
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Content Filter Settings"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Reporting & Appeals</CardTitle>
            <CardDescription>Configure how user reports are handled and appeals processed</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="reportThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report Threshold</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>Number of reports before content is automatically hidden</FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="appealProcess"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Enable Appeals Process</FormLabel>
                        <FormDescription>Allow users to appeal moderation decisions</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="appealEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Appeals Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormDescription>Email address for appeal notifications</FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="moderationTeamSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moderation Team Size</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>Number of moderators assigned to review content</FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aiModeration"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>AI-Assisted Moderation</FormLabel>
                        <FormDescription>Use AI to help prioritize moderation queue</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Reporting Settings"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Moderation Statistics</CardTitle>
          <CardDescription>Overview of recent moderation activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 flex flex-col items-center justify-center">
              <p className="text-sm text-muted-foreground">Content Flagged (24h)</p>
              <p className="text-3xl font-bold">247</p>
              <Badge variant="outline" className="mt-2 bg-amber-100 text-amber-800 border-amber-200">
                <AlertTriangle className="h-3 w-3 mr-1" /> 12% increase
              </Badge>
            </div>
            <div className="border rounded-lg p-4 flex flex-col items-center justify-center">
              <p className="text-sm text-muted-foreground">Moderation Actions (24h)</p>
              <p className="text-3xl font-bold">183</p>
              <Badge variant="outline" className="mt-2 bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" /> 98% resolution
              </Badge>
            </div>
            <div className="border rounded-lg p-4 flex flex-col items-center justify-center">
              <p className="text-sm text-muted-foreground">Appeals (24h)</p>
              <p className="text-3xl font-bold">14</p>
              <Badge variant="outline" className="mt-2 bg-blue-100 text-blue-800 border-blue-200">
                <Info className="h-3 w-3 mr-1" /> 3 approved
              </Badge>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Recent Moderation Actions</h4>
            <div className="space-y-2">
              {[
                { time: "12:45 PM", action: "Profile hidden", reason: "Inappropriate content", user: "user_284751" },
                { time: "11:32 AM", action: "Message deleted", reason: "Harassment", user: "user_193842" },
                { time: "10:15 AM", action: "Warning issued", reason: "Spam messages", user: "user_573921" },
                { time: "09:22 AM", action: "Account suspended", reason: "Multiple violations", user: "user_129384" },
                { time: "08:47 AM", action: "Appeal approved", reason: "False positive", user: "user_472913" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="text-sm font-medium">
                      {item.action} - {item.user}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.reason}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
