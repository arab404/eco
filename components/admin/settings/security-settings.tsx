"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { RefreshCw, KeyRound } from "lucide-react"

export function SecuritySettings() {
  const [settings, setSettings] = useState({
    // Authentication
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumber: true,
    passwordRequireSymbol: true,
    passwordExpiryDays: 0, // 0 means never expire
    twoFactorAuthentication: "optional", // required, optional, disabled
    loginAttempts: 5,
    loginLockoutMinutes: 30,
    sessionTimeoutMinutes: 60,

    // Privacy
    dataRetentionDays: 90,
    messageRetentionDays: 365,
    allowProfileIndexing: false,
    defaultProfileVisibility: "registered", // all, registered, matches
    ipAddressStorage: true,
    anonymizeAnalytics: true,

    // Moderation
    autoModerateMessages: true,
    autoModerateProfiles: true,
    reportThreshold: 3,
    autoBlockReportedUsers: false,
    autoReviewReportedContent: true,

    // API Security
    apiRateLimitPerMinute: 100,
    jwtExpiryMinutes: 15,
    apiTokens: [
      { name: "Web Application", expires: "2025-12-31", lastUsed: "2023-04-28" },
      { name: "Mobile App", expires: "2025-12-31", lastUsed: "2023-04-28" },
    ],
  })

  const handleChange = (key: string, value: string | number | boolean) => {
    setSettings({
      ...settings,
      [key]: value,
    })
  }

  const regenerateApiToken = (name: string) => {
    // In a real application, this would regenerate the token
    alert(`API token for ${name} would be regenerated`)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Settings</CardTitle>
          <CardDescription>Configure how users log in to your platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                <span className="text-sm font-medium">{settings.passwordMinLength} characters</span>
              </div>
              <Slider
                id="passwordMinLength"
                value={[settings.passwordMinLength]}
                min={6}
                max={16}
                step={1}
                onValueChange={(value) => handleChange("passwordMinLength", value[0])}
              />
            </div>

            <div className="space-y-3">
              <Label>Password Requirements</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="passwordRequireUppercase"
                    checked={settings.passwordRequireUppercase}
                    onCheckedChange={(checked) => handleChange("passwordRequireUppercase", checked)}
                  />
                  <Label htmlFor="passwordRequireUppercase">Require uppercase letter</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="passwordRequireLowercase"
                    checked={settings.passwordRequireLowercase}
                    onCheckedChange={(checked) => handleChange("passwordRequireLowercase", checked)}
                  />
                  <Label htmlFor="passwordRequireLowercase">Require lowercase letter</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="passwordRequireNumber"
                    checked={settings.passwordRequireNumber}
                    onCheckedChange={(checked) => handleChange("passwordRequireNumber", checked)}
                  />
                  <Label htmlFor="passwordRequireNumber">Require number</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="passwordRequireSymbol"
                    checked={settings.passwordRequireSymbol}
                    onCheckedChange={(checked) => handleChange("passwordRequireSymbol", checked)}
                  />
                  <Label htmlFor="passwordRequireSymbol">Require symbol</Label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="passwordExpiryDays">Password Expiry (Days)</Label>
                <Input
                  id="passwordExpiryDays"
                  type="number"
                  value={settings.passwordExpiryDays}
                  onChange={(e) => handleChange("passwordExpiryDays", Number.parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Set to 0 for no expiration</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeoutMinutes">Session Timeout (Minutes)</Label>
                <Input
                  id="sessionTimeoutMinutes"
                  type="number"
                  value={settings.sessionTimeoutMinutes}
                  onChange={(e) => handleChange("sessionTimeoutMinutes", Number.parseInt(e.target.value) || 30)}
                  min="5"
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="twoFactorAuthentication">Two-Factor Authentication</Label>
              <Select
                value={settings.twoFactorAuthentication}
                onValueChange={(value) => handleChange("twoFactorAuthentication", value)}
              >
                <SelectTrigger id="twoFactorAuthentication" className="w-full">
                  <SelectValue placeholder="Select 2FA policy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="required">Required for all users</SelectItem>
                  <SelectItem value="optional">Optional (user choice)</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                <Input
                  id="loginAttempts"
                  type="number"
                  value={settings.loginAttempts}
                  onChange={(e) => handleChange("loginAttempts", Number.parseInt(e.target.value) || 3)}
                  min="1"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="loginLockoutMinutes">Account Lockout (Minutes)</Label>
                <Input
                  id="loginLockoutMinutes"
                  type="number"
                  value={settings.loginLockoutMinutes}
                  onChange={(e) => handleChange("loginLockoutMinutes", Number.parseInt(e.target.value) || 15)}
                  min="1"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>Configure user data and privacy options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dataRetentionDays">Data Retention Period (Days)</Label>
                <Input
                  id="dataRetentionDays"
                  type="number"
                  value={settings.dataRetentionDays}
                  onChange={(e) => handleChange("dataRetentionDays", Number.parseInt(e.target.value) || 30)}
                  min="1"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">How long to keep inactive user data</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="messageRetentionDays">Message Retention (Days)</Label>
                <Input
                  id="messageRetentionDays"
                  type="number"
                  value={settings.messageRetentionDays}
                  onChange={(e) => handleChange("messageRetentionDays", Number.parseInt(e.target.value) || 90)}
                  min="1"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">When messages are automatically deleted</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultProfileVisibility">Default Profile Visibility</Label>
              <Select
                value={settings.defaultProfileVisibility}
                onValueChange={(value) => handleChange("defaultProfileVisibility", value)}
              >
                <SelectTrigger id="defaultProfileVisibility" className="w-full">
                  <SelectValue placeholder="Select default profile visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Everyone (including search engines)</SelectItem>
                  <SelectItem value="registered">Registered users only</SelectItem>
                  <SelectItem value="matches">Matches only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allowProfileIndexing">Allow Search Engine Indexing</Label>
                <p className="text-sm text-muted-foreground">Let search engines index user profiles</p>
              </div>
              <Switch
                id="allowProfileIndexing"
                checked={settings.allowProfileIndexing}
                onCheckedChange={(checked) => handleChange("allowProfileIndexing", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="ipAddressStorage">Store IP Addresses</Label>
                <p className="text-sm text-muted-foreground">Store user IP addresses for security purposes</p>
              </div>
              <Switch
                id="ipAddressStorage"
                checked={settings.ipAddressStorage}
                onCheckedChange={(checked) => handleChange("ipAddressStorage", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="anonymizeAnalytics">Anonymize Analytics</Label>
                <p className="text-sm text-muted-foreground">
                  Remove personally identifiable information from analytics data
                </p>
              </div>
              <Switch
                id="anonymizeAnalytics"
                checked={settings.anonymizeAnalytics}
                onCheckedChange={(checked) => handleChange("anonymizeAnalytics", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Moderation</CardTitle>
          <CardDescription>Configure automated content moderation settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoModerateMessages">Auto-Moderate Messages</Label>
                <p className="text-sm text-muted-foreground">Automatically detect and block inappropriate messages</p>
              </div>
              <Switch
                id="autoModerateMessages"
                checked={settings.autoModerateMessages}
                onCheckedChange={(checked) => handleChange("autoModerateMessages", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoModerateProfiles">Auto-Moderate Profiles</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically detect and block inappropriate profile content
                </p>
              </div>
              <Switch
                id="autoModerateProfiles"
                checked={settings.autoModerateProfiles}
                onCheckedChange={(checked) => handleChange("autoModerateProfiles", checked)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="reportThreshold">Report Threshold</Label>
                <span className="text-sm font-medium">{settings.reportThreshold} reports</span>
              </div>
              <Slider
                id="reportThreshold"
                value={[settings.reportThreshold]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => handleChange("reportThreshold", value[0])}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Number of reports before content is automatically flagged for review
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoBlockReportedUsers">Auto-Block Reported Users</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically block users who exceed the report threshold
                </p>
              </div>
              <Switch
                id="autoBlockReportedUsers"
                checked={settings.autoBlockReportedUsers}
                onCheckedChange={(checked) => handleChange("autoBlockReportedUsers", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoReviewReportedContent">Auto-Review Reported Content</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically prioritize reported content for moderation review
                </p>
              </div>
              <Switch
                id="autoReviewReportedContent"
                checked={settings.autoReviewReportedContent}
                onCheckedChange={(checked) => handleChange("autoReviewReportedContent", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Security</CardTitle>
          <CardDescription>Configure API rate limits and tokens</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="apiRateLimitPerMinute">API Rate Limit (per minute)</Label>
                <Input
                  id="apiRateLimitPerMinute"
                  type="number"
                  value={settings.apiRateLimitPerMinute}
                  onChange={(e) => handleChange("apiRateLimitPerMinute", Number.parseInt(e.target.value) || 60)}
                  min="1"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jwtExpiryMinutes">JWT Token Expiry (Minutes)</Label>
                <Input
                  id="jwtExpiryMinutes"
                  type="number"
                  value={settings.jwtExpiryMinutes}
                  onChange={(e) => handleChange("jwtExpiryMinutes", Number.parseInt(e.target.value) || 15)}
                  min="1"
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>API Tokens</Label>
              <div className="space-y-3 border rounded-lg p-4">
                {settings.apiTokens.map((token) => (
                  <div key={token.name} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium flex items-center">
                        <KeyRound className="h-4 w-4 mr-2 text-muted-foreground" />
                        {token.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Expires: {token.expires} • Last used: {token.lastUsed}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => regenerateApiToken(token.name)}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SecuritySettings
