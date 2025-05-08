"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, CreditCard, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: "monthly" | "yearly" | "lifetime"
  features: string[]
  isPopular: boolean
  isActive: boolean
}

interface PaymentProvider {
  id: string
  name: string
  isActive: boolean
  keys: Record<string, string>
}

export function PaymentSettings() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([
    {
      id: "1",
      name: "Basic",
      price: 9.99,
      interval: "monthly",
      features: ["Basic match suggestions", "Limited messaging", "10 likes per day"],
      isPopular: false,
      isActive: true,
    },
    {
      id: "2",
      name: "Premium",
      price: 19.99,
      interval: "monthly",
      features: ["Advanced match algorithm", "Unlimited messaging", "See who likes you", "Unlimited likes", "No ads"],
      isPopular: true,
      isActive: true,
    },
    {
      id: "3",
      name: "Premium Annual",
      price: 199.99,
      interval: "yearly",
      features: [
        "All Premium features",
        "Priority support",
        "Profile boost once per month",
        "16% discount over monthly",
      ],
      isPopular: false,
      isActive: true,
    },
  ])

  const [providers, setProviders] = useState<PaymentProvider[]>([
    {
      id: "stripe",
      name: "Stripe",
      isActive: true,
      keys: {
        publishableKey: "pk_test_...",
        secretKey: "sk_test_...",
      },
    },
    {
      id: "paypal",
      name: "PayPal",
      isActive: false,
      keys: {
        clientId: "",
        clientSecret: "",
      },
    },
  ])

  const [settings, setSettings] = useState({
    currency: "USD",
    taxRate: 0,
    enableTrialPeriod: true,
    trialDays: 7,
    automaticRenewal: true,
    allowCancellation: true,
    cancellationNoticeDays: 3,
    refundPolicy: "We offer full refunds within 14 days of purchase if you're not satisfied with our service.",
    invoicePrefix: "ECO-",
    invoiceFooter: "Thank you for your business!",
    enableCoupons: true,
  })

  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null)
  const [currentProvider, setCurrentProvider] = useState<PaymentProvider | null>(null)

  const [formError, setFormError] = useState<string | null>(null)

  // Plan form state
  const [planForm, setPlanForm] = useState<Partial<SubscriptionPlan>>({
    name: "",
    price: 0,
    interval: "monthly",
    features: [],
    isPopular: false,
    isActive: true,
  })

  // Provider form state
  const [providerForm, setProviderForm] = useState<Partial<PaymentProvider>>({
    id: "",
    name: "",
    isActive: false,
    keys: {},
  })

  const [newFeature, setNewFeature] = useState("")

  const handleSettingChange = (key: string, value: string | number | boolean) => {
    setSettings({
      ...settings,
      [key]: value,
    })
  }

  const handleAddPlan = () => {
    // Validate
    if (!planForm.name || !planForm.price) {
      setFormError("Plan name and price are required")
      return
    }

    const newId = (Math.max(...plans.map((plan) => Number.parseInt(plan.id)), 0) + 1).toString()

    const newPlan: SubscriptionPlan = {
      id: newId,
      name: planForm.name || "",
      price: planForm.price || 0,
      interval: planForm.interval as "monthly" | "yearly" | "lifetime",
      features: planForm.features || [],
      isPopular: planForm.isPopular || false,
      isActive: planForm.isActive !== undefined ? planForm.isActive : true,
    }

    setPlans([...plans, newPlan])
    resetPlanForm()
  }

  const handleUpdatePlan = () => {
    if (!currentPlan) return

    // Validate
    if (!planForm.name || !planForm.price) {
      setFormError("Plan name and price are required")
      return
    }

    setPlans(
      plans.map((plan) =>
        plan.id === currentPlan.id
          ? {
              ...plan,
              name: planForm.name || plan.name,
              price: planForm.price || plan.price,
              interval: (planForm.interval as "monthly" | "yearly" | "lifetime") || plan.interval,
              features: planForm.features || plan.features,
              isPopular: planForm.isPopular !== undefined ? planForm.isPopular : plan.isPopular,
              isActive: planForm.isActive !== undefined ? planForm.isActive : plan.isActive,
            }
          : plan,
      ),
    )

    resetPlanForm()
  }

  const handleDeletePlan = (id: string) => {
    setPlans(plans.filter((plan) => plan.id !== id))
  }

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setCurrentPlan(plan)
    setPlanForm(plan)
    setFormError(null)
  }

  const resetPlanForm = () => {
    setCurrentPlan(null)
    setPlanForm({
      name: "",
      price: 0,
      interval: "monthly",
      features: [],
      isPopular: false,
      isActive: true,
    })
    setNewFeature("")
    setFormError(null)
  }

  const handleAddFeature = () => {
    if (!newFeature.trim()) return

    setPlanForm({
      ...planForm,
      features: [...(planForm.features || []), newFeature.trim()],
    })
    setNewFeature("")
  }

  const handleRemoveFeature = (index: number) => {
    setPlanForm({
      ...planForm,
      features: planForm.features?.filter((_, i) => i !== index),
    })
  }

  const handleAddProvider = () => {
    // Validate
    if (!providerForm.id || !providerForm.name) {
      setFormError("Provider ID and name are required")
      return
    }

    const newProvider: PaymentProvider = {
      id: providerForm.id,
      name: providerForm.name,
      isActive: providerForm.isActive || false,
      keys: providerForm.keys || {},
    }

    setProviders([...providers, newProvider])
    resetProviderForm()
  }

  const handleUpdateProvider = () => {
    if (!currentProvider) return

    setProviders(
      providers.map((provider) =>
        provider.id === currentProvider.id
          ? {
              ...provider,
              name: providerForm.name || provider.name,
              isActive: providerForm.isActive !== undefined ? providerForm.isActive : provider.isActive,
              keys: providerForm.keys || provider.keys,
            }
          : provider,
      ),
    )

    resetProviderForm()
  }

  const handleEditProvider = (provider: PaymentProvider) => {
    setCurrentProvider(provider)
    setProviderForm(provider)
    setFormError(null)
  }

  const resetProviderForm = () => {
    setCurrentProvider(null)
    setProviderForm({
      id: "",
      name: "",
      isActive: false,
      keys: {},
    })
    setFormError(null)
  }

  const getIntervalLabel = (interval: string) => {
    switch (interval) {
      case "monthly":
        return "Monthly"
      case "yearly":
        return "Yearly"
      case "lifetime":
        return "One-time"
      default:
        return interval
    }
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Configuration</CardTitle>
          <CardDescription>Configure your payment settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={settings.currency} onValueChange={(value) => handleSettingChange("currency", value)}>
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="CAD">CAD (C$)</SelectItem>
                  <SelectItem value="AUD">AUD (A$)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={settings.taxRate}
                onChange={(e) => handleSettingChange("taxRate", Number.parseFloat(e.target.value) || 0)}
                min="0"
                max="100"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
              <Input
                id="invoicePrefix"
                value={settings.invoicePrefix}
                onChange={(e) => handleSettingChange("invoicePrefix", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoiceFooter">Invoice Footer Text</Label>
              <Input
                id="invoiceFooter"
                value={settings.invoiceFooter}
                onChange={(e) => handleSettingChange("invoiceFooter", e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableTrialPeriod">Enable Trial Period</Label>
                <p className="text-sm text-muted-foreground">Allow users to try subscription plans before paying</p>
              </div>
              <Switch
                id="enableTrialPeriod"
                checked={settings.enableTrialPeriod}
                onCheckedChange={(checked) => handleSettingChange("enableTrialPeriod", checked)}
              />
            </div>

            {settings.enableTrialPeriod && (
              <div className="ml-6 border-l pl-6 space-y-2">
                <Label htmlFor="trialDays">Trial Period (Days)</Label>
                <Input
                  id="trialDays"
                  type="number"
                  value={settings.trialDays}
                  onChange={(e) => handleSettingChange("trialDays", Number.parseInt(e.target.value) || 7)}
                  min="1"
                  className="w-full max-w-[200px]"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="automaticRenewal">Automatic Renewal</Label>
                <p className="text-sm text-muted-foreground">Automatically renew subscriptions when they expire</p>
              </div>
              <Switch
                id="automaticRenewal"
                checked={settings.automaticRenewal}
                onCheckedChange={(checked) => handleSettingChange("automaticRenewal", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allowCancellation">Allow User Cancellation</Label>
                <p className="text-sm text-muted-foreground">Allow users to cancel their subscriptions</p>
              </div>
              <Switch
                id="allowCancellation"
                checked={settings.allowCancellation}
                onCheckedChange={(checked) => handleSettingChange("allowCancellation", checked)}
              />
            </div>

            {settings.allowCancellation && (
              <div className="ml-6 border-l pl-6 space-y-2">
                <Label htmlFor="cancellationNoticeDays">Cancellation Notice (Days)</Label>
                <Input
                  id="cancellationNoticeDays"
                  type="number"
                  value={settings.cancellationNoticeDays}
                  onChange={(e) => handleSettingChange("cancellationNoticeDays", Number.parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full max-w-[200px]"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableCoupons">Enable Coupon Codes</Label>
                <p className="text-sm text-muted-foreground">Allow the use of coupon codes for discounts</p>
              </div>
              <Switch
                id="enableCoupons"
                checked={settings.enableCoupons}
                onCheckedChange={(checked) => handleSettingChange("enableCoupons", checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="refundPolicy">Refund Policy</Label>
              <Textarea
                id="refundPolicy"
                value={settings.refundPolicy}
                onChange={(e) => handleSettingChange("refundPolicy", e.target.value)}
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="plans">
        <TabsList className="mb-4">
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="providers">Payment Providers</TabsTrigger>
        </TabsList>

        <TabsContent value="plans">
          <Card>
            <CardHeader>
              <CardTitle>Manage Subscription Plans</CardTitle>
              <CardDescription>Configure your subscription offerings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Interval</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Popular</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>{plan.name}</TableCell>
                      <TableCell>{formatCurrency(plan.price)}</TableCell>
                      <TableCell>{getIntervalLabel(plan.interval)}</TableCell>
                      <TableCell>
                        {plan.isActive ? (
                          <span className="flex items-center text-green-600">
                            <span className="h-2 w-2 rounded-full bg-green-600 mr-2"></span>
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center text-gray-500">
                            <span className="h-2 w-2 rounded-full bg-gray-400 mr-2"></span>
                            Inactive
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{plan.isPopular ? "Yes" : "No"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditPlan(plan)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Plan</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete the &quot;{plan.name}&quot; plan? This action cannot
                                  be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button variant="destructive" onClick={() => handleDeletePlan(plan.id)}>
                                  Delete Plan
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Dialog open={!!currentPlan || planForm.name !== ""} onOpenChange={() => resetPlanForm()}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>{currentPlan ? "Edit Plan" : "Add Subscription Plan"}</DialogTitle>
                    <DialogDescription>
                      {currentPlan
                        ? "Update this subscription plan's details"
                        : "Create a new subscription plan for your users"}
                    </DialogDescription>
                  </DialogHeader>

                  {formError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="plan-name">Plan Name</Label>
                      <Input
                        id="plan-name"
                        value={planForm.name}
                        onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                        placeholder="e.g. Premium Plan"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="plan-price">Price</Label>
                      <Input
                        id="plan-price"
                        type="number"
                        value={planForm.price}
                        onChange={(e) => setPlanForm({ ...planForm, price: Number.parseFloat(e.target.value) || 0 })}
                        min="0"
                        step="0.01"
                        placeholder="e.g. 19.99"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="plan-interval">Billing Interval</Label>
                      <Select
                        value={planForm.interval}
                        onValueChange={(value: "monthly" | "yearly" | "lifetime") =>
                          setPlanForm({ ...planForm, interval: value })
                        }
                      >
                        <SelectTrigger id="plan-interval">
                          <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                          <SelectItem value="lifetime">One-time (Lifetime)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4 flex flex-col justify-end">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="plan-active"
                            checked={planForm.isActive}
                            onCheckedChange={(checked) => setPlanForm({ ...planForm, isActive: checked })}
                          />
                          <Label htmlFor="plan-active">Active</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="plan-popular"
                            checked={planForm.isPopular}
                            onCheckedChange={(checked) => setPlanForm({ ...planForm, isPopular: checked })}
                          />
                          <Label htmlFor="plan-popular">Popular</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label>Features</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          placeholder="Add a feature"
                          className="flex-1"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              handleAddFeature()
                            }
                          }}
                        />
                        <Button onClick={handleAddFeature}>Add</Button>
                      </div>

                      <div className="space-y-2 mt-2">
                        {planForm.features?.map((feature, index) => (
                          <div key={index} className="flex items-center justify-between bg-secondary p-2 rounded-md">
                            <span>{feature}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-1"
                              onClick={() => handleRemoveFeature(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => resetPlanForm()}>
                      Cancel
                    </Button>
                    <Button onClick={currentPlan ? handleUpdatePlan : handleAddPlan}>
                      {currentPlan ? "Update Plan" : "Add Plan"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="providers">
          <Card>
            <CardHeader>
              <CardTitle>Payment Providers</CardTitle>
              <CardDescription>Configure payment processor integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {providers.map((provider) => (
                  <div key={provider.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
                        <h3 className="font-medium text-lg">{provider.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`provider-${provider.id}-active`}
                            checked={provider.isActive}
                            onCheckedChange={(checked) => {
                              setProviders(
                                providers.map((p) => (p.id === provider.id ? { ...p, isActive: checked } : p)),
                              )
                            }}
                          />
                          <Label htmlFor={`provider-${provider.id}-active`}>
                            {provider.isActive ? "Active" : "Inactive"}
                          </Label>
                        </div>

                        <Button variant="outline" size="sm" onClick={() => handleEditProvider(provider)}>
                          Configure
                        </Button>
                      </div>
                    </div>

                    {provider.isActive && (
                      <div className="grid grid-cols-2 gap-4 p-2 bg-muted/50 rounded-md">
                        {Object.entries(provider.keys).map(([key, value]) => (
                          <div key={key} className="flex items-center">
                            <span className="text-sm font-medium mr-2">{key}:</span>
                            <span className="text-sm text-muted-foreground">
                              {key.toLowerCase().includes("secret") || key.toLowerCase().includes("key")
                                ? "••••••••••••••••"
                                : value || "Not set"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Custom Provider
              </Button>

              <Dialog
                open={!!currentProvider}
                onOpenChange={(open) => {
                  if (!open) resetProviderForm()
                }}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Configure {currentProvider?.name}</DialogTitle>
                    <DialogDescription>Enter your API keys to enable this payment provider</DialogDescription>
                  </DialogHeader>

                  {currentProvider && (
                    <div className="space-y-4">
                      {Object.keys(currentProvider.keys).map((key) => (
                        <div key={key} className="space-y-2">
                          <Label htmlFor={`provider-key-${key}`}>{key}</Label>
                          <Input
                            id={`provider-key-${key}`}
                            type={
                              key.toLowerCase().includes("secret") || key.toLowerCase().includes("key")
                                ? "password"
                                : "text"
                            }
                            value={providerForm.keys?.[key] || ""}
                            onChange={(e) =>
                              setProviderForm({
                                ...providerForm,
                                keys: { ...(providerForm.keys || {}), [key]: e.target.value },
                              })
                            }
                          />
                        </div>
                      ))}

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="provider-active"
                          checked={providerForm.isActive}
                          onCheckedChange={(checked) => setProviderForm({ ...providerForm, isActive: checked })}
                        />
                        <Label htmlFor="provider-active">Active</Label>
                      </div>
                    </div>
                  )}

                  <DialogFooter>
                    <Button variant="outline" onClick={resetProviderForm}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateProvider}>Save Configuration</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PaymentSettings
