"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Check, Loader2, Mail, TestTube } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

const notificationSettingsSchema = z.object({
  // Email notification settings
  enableEmailNotifications: z.boolean(),
  welcomeEmailSubject: z.string().min(3, { message: "Subject must be at least 3 characters." }),
  welcomeEmailTemplate: z.string().min(10, { message: "Template must be at least 10 characters." }),
  matchEmailSubject: z.string().min(3, { message: "Subject must be at least 3 characters." }),
  matchEmailTemplate: z.string().min(10, { message: "Template must be at least 10 characters." }),
  messageEmailSubject: z.string().min(3, { message: "Subject must be at least 3 characters." }),
  messageEmailTemplate: z.string().min(10, { message: "Template must be at least 10 characters." }),
  verificationEmailSubject: z.string().min(3, { message: "Subject must be at least 3 characters." }),
  verificationEmailTemplate: z.string().min(10, { message: "Template must be at least 10 characters." }),
  passwordResetEmailSubject: z.string().min(3, { message: "Subject must be at least 3 characters." }),
  passwordResetEmailTemplate: z.string().min(10, { message: "Template must be at least 10 characters." }),
  subscriptionEmailSubject: z.string().min(3, { message: "Subject must be at least 3 characters." }),
  subscriptionEmailTemplate: z.string().min(10, { message: "Template must be at least 10 characters." }),

  // Push notification settings
  enablePushNotifications: z.boolean(),
  newMatchPushTemplate: z.string().min(5, { message: "Template must be at least 5 characters." }),
  newMessagePushTemplate: z.string().min(5, { message: "Template must be at least 5 characters." }),
  profileViewPushTemplate: z.string().min(5, { message: "Template must be at least 5 characters." }),
  likePushTemplate: z.string().min(5, { message: "Template must be at least 5 characters." }),
  eventReminderPushTemplate: z.string().min(5, { message: "Template must be at least 5 characters." }),
  nearbyUsersPushTemplate: z.string().min(5, { message: "Template must be at least 5 characters." }),

  // In-app notification settings
  enableInAppNotifications: z.boolean(),
  showMatchNotifications: z.boolean(),
  showMessageNotifications: z.boolean(),
  showProfileViewNotifications: z.boolean(),
  showLikeNotifications: z.boolean(),
  showEventNotifications: z.boolean(),
  notificationLifetimeMinutes: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Must be a valid positive number.",
  }),

  // Email delivery settings
  senderName: z.string().min(2, { message: "Sender name must be at least 2 characters." }),
  senderEmail: z.string().email({ message: "Please enter a valid email address." }),
  replyToEmail: z.string().email({ message: "Please enter a valid email address." }),
  emailProvider: z.string(),
  smtpHost: z.string().min(3, { message: "SMTP host is required." }),
  smtpPort: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Must be a valid port number.",
  }),
  smtpUsername: z.string().min(3, { message: "SMTP username is required." }),
  smtpPassword: z.string().min(3, { message: "SMTP password is required." }),
  useTLS: z.boolean(),

  // Frequency settings
  dailyEmailLimit: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Must be a valid non-negative number.",
  }),
  dailyPushLimit: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Must be a valid non-negative number.",
  }),
  quietHoursStart: z.string(),
  quietHoursEnd: z.string(),
  enableQuietHours: z.boolean(),
})

type NotificationSettingsValues = z.infer<typeof notificationSettingsSchema>

export default function NotificationSettings() {
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [testEmailStatus, setTestEmailStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [testEmailError, setTestEmailError] = useState<string | null>(null)

  const defaultValues: NotificationSettingsValues = {
    // Email notification settings
    enableEmailNotifications: true,
    welcomeEmailSubject: "Welcome to LoveMatch! 💖",
    welcomeEmailTemplate:
      "Hi {{userName}},\n\nWelcome to LoveMatch! We're excited to have you join our community. Complete your profile to start matching with compatible people.\n\nBest regards,\nThe LoveMatch Team",
    matchEmailSubject: "You have a new match on LoveMatch! 🎉",
    matchEmailTemplate:
      "Hi {{userName}},\n\nGreat news! You've matched with {{matchName}}. Start a conversation and see where it leads!\n\nBest regards,\nThe LoveMatch Team",
    messageEmailSubject: "New message from {{senderName}} on LoveMatch",
    messageEmailTemplate:
      "Hi {{userName}},\n\nYou have a new message from {{senderName}} on LoveMatch. Click here to view and reply: {{messageLink}}\n\nBest regards,\nThe LoveMatch Team",
    verificationEmailSubject: "Verify your email address for LoveMatch",
    verificationEmailTemplate:
      "Hi {{userName}},\n\nPlease verify your email address by clicking on the link below:\n\n{{verificationLink}}\n\nIf you did not create an account, please ignore this email.\n\nBest regards,\nThe LoveMatch Team",
    passwordResetEmailSubject: "Reset your LoveMatch password",
    passwordResetEmailTemplate:
      "Hi {{userName}},\n\nWe received a request to reset your password. Click the link below to set a new password:\n\n{{resetLink}}\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nThe LoveMatch Team",
    subscriptionEmailSubject: "Your LoveMatch subscription has been updated",
    subscriptionEmailTemplate:
      "Hi {{userName}},\n\nYour subscription has been updated to {{planName}}. Your subscription is valid until {{expiryDate}}.\n\nThank you for your support!\n\nBest regards,\nThe LoveMatch Team",

    // Push notification settings
    enablePushNotifications: true,
    newMatchPushTemplate: "🎉 You matched with {{matchName}}!",
    newMessagePushTemplate: "💬 {{senderName}}: {{messagePreview}}",
    profileViewPushTemplate: "👀 {{viewerName}} viewed your profile",
    likePushTemplate: "❤️ {{likerName}} liked your profile",
    eventReminderPushTemplate: "🗓️ Reminder: {{eventName}} starts in {{timeUntil}}",
    nearbyUsersPushTemplate: "📍 {{count}} potential matches nearby!",

    // In-app notification settings
    enableInAppNotifications: true,
    showMatchNotifications: true,
    showMessageNotifications: true,
    showProfileViewNotifications: true,
    showLikeNotifications: true,
    showEventNotifications: true,
    notificationLifetimeMinutes: "10080", // 7 days

    // Email delivery settings
    senderName: "LoveMatch",
    senderEmail: "notifications@lovematch.com",
    replyToEmail: "no-reply@lovematch.com",
    emailProvider: "smtp",
    smtpHost: "smtp.sendgrid.net",
    smtpPort: "587",
    smtpUsername: "apikey",
    smtpPassword: "SG.xxxxxxxxxxxxxxxxxxxx",
    useTLS: true,

    // Frequency settings
    dailyEmailLimit: "5",
    dailyPushLimit: "10",
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
    enableQuietHours: true,
  }

  const form = useForm<NotificationSettingsValues>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues,
    mode: "onChange",
  })

  function onSubmit(data: NotificationSettingsValues) {
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

        console.log("Saving notification settings:", data)
        setIsSaving(false)
        setSaveSuccess(true)

        toast({
          title: "Notification settings updated",
          description: "Your notification settings have been saved successfully.",
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

  const sendTestEmail = () => {
    setTestEmailStatus("sending")
    setTestEmailError(null)

    // Simulate API call
    setTimeout(() => {
      try {
        // Simulate random error (20% chance)
        if (Math.random() < 0.2) {
          throw new Error("Failed to send test email. Check SMTP settings and try again.")
        }

        setTestEmailStatus("success")

        toast({
          title: "Test email sent",
          description: "A test email has been sent to " + form.getValues("senderEmail"),
        })

        // Reset status after 3 seconds
        setTimeout(() => setTestEmailStatus("idle"), 3000)
      } catch (error) {
        setTestEmailStatus("error")
        setTestEmailError(error instanceof Error ? error.message : "An unknown error occurred")

        toast({
          variant: "destructive",
          title: "Error sending test email",
          description: error instanceof Error ? error.message : "An unknown error occurred",
        })
      }
    }, 2000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid grid-cols-5 w-full max-w-3xl">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="push">Push</TabsTrigger>
            <TabsTrigger value="in-app">In-App</TabsTrigger>
            <TabsTrigger value="delivery">Delivery</TabsTrigger>
            <TabsTrigger value="frequency">Frequency</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Email Notifications</CardTitle>
                    <CardDescription>Configure email notification templates</CardDescription>
                  </div>
                  <FormField
                    control={form.control}
                    name="enableEmailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2">
                        <FormLabel>Enable</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="welcome-email" className="border-b">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>Welcome Email</span>
                        <Badge variant="outline" className="ml-2">
                          System
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <FormField
                        control={form.control}
                        name="welcomeEmailSubject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject Line</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="welcomeEmailTemplate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Template</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={6} placeholder="Enter the welcome email template" />
                            </FormControl>
                            <FormDescription>
                              Available variables: <code>{"{{userName}}"}</code>, <code>{"{{appName}}"}</code>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="match-email" className="border-b">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>New Match Email</span>
                        <Badge variant="outline" className="ml-2">
                          Engagement
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <FormField
                        control={form.control}
                        name="matchEmailSubject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject Line</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="matchEmailTemplate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Template</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={6} placeholder="Enter the match notification email template" />
                            </FormControl>
                            <FormDescription>
                              Available variables: <code>{"{{userName}}"}</code>, <code>{"{{matchName}}"}</code>,{" "}
                              <code>{"{{matchProfileLink}}"}</code>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="message-email" className="border-b">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>New Message Email</span>
                        <Badge variant="outline" className="ml-2">
                          Engagement
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <FormField
                        control={form.control}
                        name="messageEmailSubject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject Line</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="messageEmailTemplate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Template</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={6} placeholder="Enter the new message email template" />
                            </FormControl>
                            <FormDescription>
                              Available variables: <code>{"{{userName}}"}</code>, <code>{"{{senderName}}"}</code>,{" "}
                              <code>{"{{messagePreview}}"}</code>, <code>{"{{messageLink}}"}</code>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="verification-email" className="border-b">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>Email Verification</span>
                        <Badge variant="outline" className="ml-2">
                          System
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <FormField
                        control={form.control}
                        name="verificationEmailSubject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject Line</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="verificationEmailTemplate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Template</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={6} placeholder="Enter the email verification template" />
                            </FormControl>
                            <FormDescription>
                              Available variables: <code>{"{{userName}}"}</code>, <code>{"{{verificationLink}}"}</code>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="password-reset-email" className="border-b">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>Password Reset</span>
                        <Badge variant="outline" className="ml-2">
                          System
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <FormField
                        control={form.control}
                        name="passwordResetEmailSubject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject Line</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="passwordResetEmailTemplate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Template</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={6} placeholder="Enter the password reset email template" />
                            </FormControl>
                            <FormDescription>
                              Available variables: <code>{"{{userName}}"}</code>, <code>{"{{resetLink}}"}</code>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="subscription-email" className="border-b">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>Subscription Update</span>
                        <Badge variant="outline" className="ml-2">
                          Billing
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <FormField
                        control={form.control}
                        name="subscriptionEmailSubject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject Line</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subscriptionEmailTemplate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Template</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={6}
                                placeholder="Enter the subscription update email template"
                              />
                            </FormControl>
                            <FormDescription>
                              Available variables: <code>{"{{userName}}"}</code>, <code>{"{{planName}}"}</code>,{" "}
                              <code>{"{{expiryDate}}"}</code>, <code>{"{{amount}}"}</code>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="push" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Push Notifications</CardTitle>
                    <CardDescription>Configure push notification templates</CardDescription>
                  </div>
                  <FormField
                    control={form.control}
                    name="enablePushNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2">
                        <FormLabel>Enable</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="newMatchPushTemplate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Match Notification</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Available variables: <code>{"{{matchName}}"}</code>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="newMessagePushTemplate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Message Notification</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Available variables: <code>{"{{senderName}}"}</code>, <code>{"{{messagePreview}}"}</code>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="profileViewPushTemplate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile View Notification</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Available variables: <code>{"{{viewerName}}"}</code>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="likePushTemplate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Like Notification</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Available variables: <code>{"{{likerName}}"}</code>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="eventReminderPushTemplate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Reminder Notification</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Available variables: <code>{"{{eventName}}"}</code>, <code>{"{{timeUntil}}"}</code>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nearbyUsersPushTemplate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nearby Users Notification</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Available variables: <code>{"{{count}}"}</code>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="in-app" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>In-App Notifications</CardTitle>
                    <CardDescription>Configure in-app notification settings</CardDescription>
                  </div>
                  <FormField
                    control={form.control}
                    name="enableInAppNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2">
                        <FormLabel>Enable</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="showMatchNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Match Notifications</FormLabel>
                            <FormDescription>Show notifications for new matches.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="showMessageNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Message Notifications</FormLabel>
                            <FormDescription>Show notifications for new messages.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="showProfileViewNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Profile View Notifications</FormLabel>
                            <FormDescription>Show notifications when someone views your profile.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="showLikeNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Like Notifications</FormLabel>
                            <FormDescription>Show notifications when someone likes your profile.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="showEventNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Event Notifications</FormLabel>
                            <FormDescription>Show notifications for events and reminders.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <FormField
                    control={form.control}
                    name="notificationLifetimeMinutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notification Lifetime (minutes)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="1" />
                        </FormControl>
                        <FormDescription>
                          How long notifications remain in the notification center before auto-dismissal. Use 10080 for
                          7 days.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="delivery" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Delivery Settings</CardTitle>
                <CardDescription>Configure email delivery service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="senderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sender Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>Name that appears in the "From" field.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="senderEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sender Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormDescription>Email address that appears in the "From" field.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="replyToEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reply-To Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormDescription>Email address for user replies.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emailProvider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Provider</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select email provider" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="smtp">Custom SMTP</SelectItem>
                          <SelectItem value="sendgrid">SendGrid</SelectItem>
                          <SelectItem value="mailchimp">Mailchimp</SelectItem>
                          <SelectItem value="ses">Amazon SES</SelectItem>
                          <SelectItem value="mailgun">Mailgun</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Select your email delivery service.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("emailProvider") === "smtp" && (
                  <div className="space-y-6 border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="smtpHost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SMTP Host</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="smtpPort"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SMTP Port</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="smtpUsername"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SMTP Username</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="smtpPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SMTP Password</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="useTLS"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2">
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel>Use TLS Encryption</FormLabel>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={sendTestEmail}
                        disabled={testEmailStatus === "sending"}
                      >
                        {testEmailStatus === "sending" ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : testEmailStatus === "success" ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Sent
                          </>
                        ) : (
                          <>
                            <TestTube className="mr-2 h-4 w-4" />
                            Send Test Email
                          </>
                        )}
                      </Button>
                    </div>

                    {testEmailError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{testEmailError}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="frequency" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Frequency</CardTitle>
                <CardDescription>Control how often notifications are sent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="dailyEmailLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Daily Email Limit</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="0" />
                        </FormControl>
                        <FormDescription>
                          Maximum number of emails sent to a user per day. Set to 0 for no limit.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dailyPushLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Daily Push Notification Limit</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="0" />
                        </FormControl>
                        <FormDescription>
                          Maximum number of push notifications sent to a user per day. Set to 0 for no limit.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="enableQuietHours"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Quiet Hours</FormLabel>
                        <FormDescription>Don't send notifications during specified hours.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("enableQuietHours") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-6 border-l pl-6">
                    <FormField
                      control={form.control}
                      name="quietHoursStart"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quiet Hours Start</FormLabel>
                          <FormControl>
                            <Input {...field} type="time" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="quietHoursEnd"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quiet Hours End</FormLabel>
                          <FormControl>
                            <Input {...field} type="time" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
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
