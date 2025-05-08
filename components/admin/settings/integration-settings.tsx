"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Facebook,
  Instagram,
  MessageSquare,
  PieChart,
  Smartphone,
  Twitter,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const socialIntegrationsSchema = z.object({
  facebookEnabled: z.boolean(),
  facebookAppId: z.string().optional(),
  facebookAppSecret: z.string().optional(),
  instagramEnabled: z.boolean(),
  instagramAppId: z.string().optional(),
  instagramAppSecret: z.string().optional(),
  twitterEnabled: z.boolean(),
  twitterApiKey: z.string().optional(),
  twitterApiSecret: z.string().optional(),
})

const paymentIntegrationsSchema = z.object({
  stripeEnabled: z.boolean(),
  stripePublicKey: z.string().optional(),
  stripeSecretKey: z.string().optional(),
  paypalEnabled: z.boolean(),
  paypalClientId: z.string().optional(),
  paypalClientSecret: z.string().optional(),
})

const analyticsIntegrationsSchema = z.object({
  googleAnalyticsEnabled: z.boolean(),
  googleAnalyticsId: z.string().optional(),
  mixpanelEnabled: z.boolean(),
  mixpanelToken: z.string().optional(),
  hotjarEnabled: z.boolean(),
  hotjarId: z.string().optional(),
})

const messagingIntegrationsSchema = z.object({
  twilioEnabled: z.boolean(),
  twilioAccountSid: z.string().optional(),
  twilioAuthToken: z.string().optional(),
  twilioPhoneNumber: z.string().optional(),
  sendgridEnabled: z.boolean(),
  sendgridApiKey: z.string().optional(),
  sendgridFromEmail: z.string().email().optional(),
})

export default function IntegrationSettings() {
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("social")

  const socialForm = useForm<z.infer<typeof socialIntegrationsSchema>>({
    resolver: zodResolver(socialIntegrationsSchema),
    defaultValues: {
      facebookEnabled: true,
      facebookAppId: "123456789012345",
      facebookAppSecret: "••••••••••••••••••••••••••••••",
      instagramEnabled: true,
      instagramAppId: "987654321098765",
      instagramAppSecret: "••••••••••••••••••••••••••••••",
      twitterEnabled: false,
      twitterApiKey: "",
      twitterApiSecret: "",
    },
  })

  const paymentForm = useForm<z.infer<typeof paymentIntegrationsSchema>>({
    resolver: zodResolver(paymentIntegrationsSchema),
    defaultValues: {
      stripeEnabled: true,
      stripePublicKey: "pk_test_••••••••••••••••••••••••••••••",
      stripeSecretKey: "sk_test_••••••••••••••••••••••••••••••",
      paypalEnabled: false,
      paypalClientId: "",
      paypalClientSecret: "",
    },
  })

  const analyticsForm = useForm<z.infer<typeof analyticsIntegrationsSchema>>({
    resolver: zodResolver(analyticsIntegrationsSchema),
    defaultValues: {
      googleAnalyticsEnabled: true,
      googleAnalyticsId: "UA-123456789-1",
      mixpanelEnabled: true,
      mixpanelToken: "abcdef123456",
      hotjarEnabled: false,
      hotjarId: "",
    },
  })

  const messagingForm = useForm<z.infer<typeof messagingIntegrationsSchema>>({
    resolver: zodResolver(messagingIntegrationsSchema),
    defaultValues: {
      twilioEnabled: true,
      twilioAccountSid: "AC••••••••••••••••••••••••••••••",
      twilioAuthToken: "••••••••••••••••••••••••••••••",
      twilioPhoneNumber: "+15551234567",
      sendgridEnabled: true,
      sendgridApiKey: "SG.••••••••••••••••••••••••••••••",
      sendgridFromEmail: "noreply@datingapp.com",
    },
  })

  function onSubmit(values: any) {
    setIsSaving(true)
    console.log(values)
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Integration Settings</h3>
        <p className="text-sm text-muted-foreground">
          Connect your dating app with third-party services and platforms.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Integration Status</CardTitle>
            <CardDescription>Overview of your current integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <Facebook className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-sm font-medium">Facebook</p>
                <Badge variant="outline" className="mt-1 bg-green-100 text-green-800 border-green-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Connected
                </Badge>
              </div>

              <div className="border rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <Instagram className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-sm font-medium">Instagram</p>
                <Badge variant="outline" className="mt-1 bg-green-100 text-green-800 border-green-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Connected
                </Badge>
              </div>

              <div className="border rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mb-2">
                  <Twitter className="h-5 w-5 text-red-600" />
                </div>
                <p className="text-sm font-medium">Twitter</p>
                <Badge variant="outline" className="mt-1 bg-red-100 text-red-800 border-red-200">
                  <AlertCircle className="h-3 w-3 mr-1" /> Not Connected
                </Badge>
              </div>

              <div className="border rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-sm font-medium">Stripe</p>
                <Badge variant="outline" className="mt-1 bg-green-100 text-green-800 border-green-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Connected
                </Badge>
              </div>

              <div className="border rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mb-2">
                  <CreditCard className="h-5 w-5 text-red-600" />
                </div>
                <p className="text-sm font-medium">PayPal</p>
                <Badge variant="outline" className="mt-1 bg-red-100 text-red-800 border-red-200">
                  <AlertCircle className="h-3 w-3 mr-1" /> Not Connected
                </Badge>
              </div>

              <div className="border rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <PieChart className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-sm font-medium">Google Analytics</p>
                <Badge variant="outline" className="mt-1 bg-green-100 text-green-800 border-green-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Connected
                </Badge>
              </div>

              <div className="border rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-sm font-medium">Twilio</p>
                <Badge variant="outline" className="mt-1 bg-green-100 text-green-800 border-green-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Connected
                </Badge>
              </div>

              <div className="border rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <Smartphone className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-sm font-medium">Push Notifications</p>
                <Badge variant="outline" className="mt-1 bg-green-100 text-green-800 border-green-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Connected
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Configure Integrations</CardTitle>
            <CardDescription>Manage your third-party service connections</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                <TabsTrigger value="social">Social Media</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="messaging">Messaging</TabsTrigger>
              </TabsList>

              <TabsContent value="social" className="space-y-6">
                <Form {...socialForm}>
                  <form onSubmit={socialForm.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium flex items-center">
                        <Facebook className="h-4 w-4 mr-2" /> Facebook Integration
                      </h4>

                      <FormField
                        control={socialForm.control}
                        name="facebookEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Enable Facebook Integration</FormLabel>
                              <FormDescription>Allow users to sign in with Facebook</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={socialForm.control}
                        name="facebookAppId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Facebook App ID</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>Enter your Facebook App ID</FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={socialForm.control}
                        name="facebookAppSecret"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Facebook App Secret</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormDescription>Enter your Facebook App Secret</FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium flex items-center">
                        <Instagram className="h-4 w-4 mr-2" /> Instagram Integration
                      </h4>

                      <FormField
                        control={socialForm.control}
                        name="instagramEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Enable Instagram Integration</FormLabel>
                              <FormDescription>Allow users to connect their Instagram account</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={socialForm.control}
                        name="instagramAppId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instagram App ID</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>Enter your Instagram App ID</FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={socialForm.control}
                        name="instagramAppSecret"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instagram App Secret</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormDescription>Enter your Instagram App Secret</FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Social Media Settings"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="payment" className="space-y-6">
                <Form {...paymentForm}>
                  <form onSubmit={paymentForm.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" /> Stripe Integration
                      </h4>

                      <FormField
                        control={paymentForm.control}
                        name="stripeEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Enable Stripe Integration</FormLabel>
                              <FormDescription>Process payments with Stripe</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={paymentForm.control}
                        name="stripePublicKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stripe Public Key</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>Enter your Stripe Public Key</FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={paymentForm.control}
                        name="stripeSecretKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stripe Secret Key</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormDescription>Enter your Stripe Secret Key</FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Payment Settings"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <Form {...analyticsForm}>
                  <form onSubmit={analyticsForm.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium flex items-center">
                        <PieChart className="h-4 w-4 mr-2" /> Analytics Integrations
                      </h4>

                      <FormField
                        control={analyticsForm.control}
                        name="googleAnalyticsEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Enable Google Analytics</FormLabel>
                              <FormDescription>Track user behavior with Google Analytics</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={analyticsForm.control}
                        name="googleAnalyticsId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Google Analytics ID</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>Enter your Google Analytics ID</FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={analyticsForm.control}
                        name="mixpanelEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Enable Mixpanel</FormLabel>
                              <FormDescription>Track user events with Mixpanel</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Analytics Settings"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="messaging" className="space-y-6">
                <Form {...messagingForm}>
                  <form onSubmit={messagingForm.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" /> Messaging Integrations
                      </h4>

                      <FormField
                        control={messagingForm.control}
                        name="twilioEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Enable Twilio</FormLabel>
                              <FormDescription>Send SMS notifications with Twilio</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={messagingForm.control}
                        name="twilioAccountSid"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Twilio Account SID</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>Enter your Twilio Account SID</FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={messagingForm.control}
                        name="sendgridEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Enable SendGrid</FormLabel>
                              <FormDescription>Send emails with SendGrid</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={messagingForm.control}
                        name="sendgridApiKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SendGrid API Key</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormDescription>Enter your SendGrid API Key</FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Messaging Settings"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
