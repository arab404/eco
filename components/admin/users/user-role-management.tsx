"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import {
  Plus,
  Edit,
  Trash2,
  Shield,
  ShieldAlert,
  User,
  Database,
  Settings,
  UserCog,
  Star,
  CheckCircle,
  Flag,
} from "lucide-react"

// Mock roles data
const mockRoles = [
  {
    id: "role_1",
    name: "Administrator",
    description: "Full access to all system features and settings",
    permissions: [
      "manage_users",
      "manage_content",
      "manage_settings",
      "manage_roles",
      "manage_payments",
      "view_analytics",
      "manage_verifications",
      "manage_reports",
    ],
    userCount: 2,
    icon: <ShieldAlert className="h-5 w-5 text-red-500" />,
  },
  {
    id: "role_2",
    name: "Moderator",
    description: "Can moderate content and manage user reports",
    permissions: ["manage_content", "manage_reports", "view_users", "manage_verifications"],
    userCount: 5,
    icon: <Shield className="h-5 w-5 text-blue-500" />,
  },
  {
    id: "role_3",
    name: "Support",
    description: "Can view user information and respond to user inquiries",
    permissions: ["view_users", "view_content", "manage_reports"],
    userCount: 8,
    icon: <UserCog className="h-5 w-5 text-green-500" />,
  },
  {
    id: "role_4",
    name: "User",
    description: "Standard user account with basic permissions",
    permissions: [],
    userCount: 1250,
    icon: <User className="h-5 w-5 text-gray-500" />,
  },
  {
    id: "role_5",
    name: "Premium User",
    description: "User with paid subscription and premium features",
    permissions: [],
    userCount: 320,
    icon: <Star className="h-5 w-5 text-amber-500" />,
  },
]

// Available permissions for role management
const availablePermissions = [
  {
    id: "manage_users",
    label: "Manage Users",
    description: "Create, update, and delete user accounts",
    category: "users",
    icon: <User className="h-4 w-4" />,
  },
  {
    id: "view_users",
    label: "View Users",
    description: "View user information and profiles",
    category: "users",
    icon: <User className="h-4 w-4" />,
  },
  {
    id: "manage_content",
    label: "Manage Content",
    description: "Create, update, and delete content across the platform",
    category: "content",
    icon: <Database className="h-4 w-4" />,
  },
  {
    id: "view_content",
    label: "View Content",
    description: "View all content including moderated content",
    category: "content",
    icon: <Database className="h-4 w-4" />,
  },
  {
    id: "manage_settings",
    label: "Manage Settings",
    description: "Change system settings and configurations",
    category: "settings",
    icon: <Settings className="h-4 w-4" />,
  },
  {
    id: "manage_roles",
    label: "Manage Roles",
    description: "Create, update, and delete user roles",
    category: "users",
    icon: <ShieldAlert className="h-4 w-4" />,
  },
  {
    id: "manage_payments",
    label: "Manage Payments",
    description: "Process payments and manage subscriptions",
    category: "billing",
    icon: <Database className="h-4 w-4" />,
  },
  {
    id: "view_analytics",
    label: "View Analytics",
    description: "Access analytics and reporting dashboards",
    category: "analytics",
    icon: <Database className="h-4 w-4" />,
  },
  {
    id: "manage_verifications",
    label: "Manage Verifications",
    description: "Review and process user verification requests",
    category: "users",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  {
    id: "manage_reports",
    label: "Manage Reports",
    description: "Review and process user reports and flags",
    category: "content",
    icon: <Flag className="h-4 w-4" />,
  },
]

export function UserRoleManagement() {
  const { toast } = useToast()
  const [roles, setRoles] = useState(mockRoles)
  const [isNewRoleDialogOpen, setIsNewRoleDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<(typeof mockRoles)[0] | null>(null)
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  })

  // Handle permission toggle for role creation/editing
  const handlePermissionToggle = (permissionId: string) => {
    if (editingRole) {
      // Editing existing role
      const currentPermissions = [...editingRole.permissions]

      if (currentPermissions.includes(permissionId)) {
        setEditingRole({
          ...editingRole,
          permissions: currentPermissions.filter((id) => id !== permissionId),
        })
      } else {
        setEditingRole({
          ...editingRole,
          permissions: [...currentPermissions, permissionId],
        })
      }
    } else {
      // Creating new role
      const currentPermissions = [...newRole.permissions]

      if (currentPermissions.includes(permissionId)) {
        setNewRole({
          ...newRole,
          permissions: currentPermissions.filter((id) => id !== permissionId),
        })
      } else {
        setNewRole({
          ...newRole,
          permissions: [...currentPermissions, permissionId],
        })
      }
    }
  }

  // Get permissions by category
  const getPermissionsByCategory = () => {
    const categories: Record<string, typeof availablePermissions> = {}

    availablePermissions.forEach((permission) => {
      if (!categories[permission.category]) {
        categories[permission.category] = []
      }
      categories[permission.category].push(permission)
    })

    return categories
  }

  // Handle role creation
  const handleCreateRole = () => {
    if (!newRole.name) {
      toast({
        title: "Error",
        description: "Role name is required",
        variant: "destructive",
      })
      return
    }

    const newRoleData = {
      id: `role_${Date.now()}`,
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions,
      userCount: 0,
      icon: <Shield className="h-5 w-5 text-gray-500" />,
    }

    setRoles([...roles, newRoleData])
    setNewRole({
      name: "",
      description: "",
      permissions: [],
    })
    setIsNewRoleDialogOpen(false)

    toast({
      title: "Role created",
      description: `The role "${newRole.name}" has been created successfully.`,
    })
  }

  // Handle role update
  const handleUpdateRole = () => {
    if (!editingRole) return

    if (!editingRole.name) {
      toast({
        title: "Error",
        description: "Role name is required",
        variant: "destructive",
      })
      return
    }

    setRoles(roles.map((role) => (role.id === editingRole.id ? editingRole : role)))

    setEditingRole(null)

    toast({
      title: "Role updated",
      description: `The role "${editingRole.name}" has been updated successfully.`,
    })
  }

  // Handle role deletion
  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter((role) => role.id !== roleId))

    toast({
      title: "Role deleted",
      description: "The role has been deleted successfully.",
    })
  }

  // Edit role
  const startEditingRole = (role: (typeof mockRoles)[0]) => {
    setEditingRole(role)
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditingRole(null)
  }

  // Get permission count text
  const getPermissionCountText = (permissions: string[]) => {
    if (permissions.length === 0) {
      return "No special permissions"
    } else if (permissions.length === 1) {
      return "1 permission"
    } else {
      return `${permissions.length} permissions`
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold">User Roles & Permissions</h2>
          <p className="text-sm text-gray-500">Manage user roles and their permissions</p>
        </div>

        <Dialog open={isNewRoleDialogOpen} onOpenChange={setIsNewRoleDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Role
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>Define a new user role with specific permissions</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  placeholder="e.g. Content Manager"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  placeholder="Describe the role's purpose and responsibilities"
                  rows={2}
                />
              </div>

              <div className="grid gap-2">
                <Label>Permissions</Label>
                <div className="border rounded-md p-4 space-y-4 max-h-[300px] overflow-y-auto">
                  {Object.entries(getPermissionsByCategory()).map(([category, permissions]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="text-sm font-semibold capitalize">{category}</h4>
                      <div className="space-y-2">
                        {permissions.map((permission) => (
                          <div key={permission.id} className="flex items-start space-x-2">
                            <Checkbox
                              id={`permission-${permission.id}`}
                              checked={newRole.permissions.includes(permission.id)}
                              onCheckedChange={() => handlePermissionToggle(permission.id)}
                            />
                            <div className="grid gap-1.5">
                              <label
                                htmlFor={`permission-${permission.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                              >
                                {permission.icon}
                                <span className="ml-2">{permission.label}</span>
                              </label>
                              <p className="text-sm text-gray-500">{permission.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewRoleDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRole}>Create Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!editingRole} onOpenChange={(open) => !open && cancelEditing()}>
          {editingRole && (
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Role: {editingRole.name}</DialogTitle>
                <DialogDescription>Modify this role's details and permissions</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Role Name</Label>
                  <Input
                    id="edit-name"
                    value={editingRole.name}
                    onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingRole.description}
                    onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Permissions</Label>
                  <div className="border rounded-md p-4 space-y-4 max-h-[300px] overflow-y-auto">
                    {Object.entries(getPermissionsByCategory()).map(([category, permissions]) => (
                      <div key={category} className="space-y-2">
                        <h4 className="text-sm font-semibold capitalize">{category}</h4>
                        <div className="space-y-2">
                          {permissions.map((permission) => (
                            <div key={permission.id} className="flex items-start space-x-2">
                              <Checkbox
                                id={`edit-permission-${permission.id}`}
                                checked={editingRole.permissions.includes(permission.id)}
                                onCheckedChange={() => handlePermissionToggle(permission.id)}
                              />
                              <div className="grid gap-1.5">
                                <label
                                  htmlFor={`edit-permission-${permission.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                                >
                                  {permission.icon}
                                  <span className="ml-2">{permission.label}</span>
                                </label>
                                <p className="text-sm text-gray-500">{permission.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={cancelEditing}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateRole}>Update Role</Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {roles.map((role) => (
          <Card key={role.id} className="flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {role.icon}
                  <CardTitle className="text-lg">{role.name}</CardTitle>
                </div>
                <Badge variant="outline">
                  {role.userCount} {role.userCount === 1 ? "user" : "users"}
                </Badge>
              </div>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-gray-500 mb-2">{getPermissionCountText(role.permissions)}</p>

              {role.permissions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {role.permissions.map((permId) => {
                    const permission = availablePermissions.find((p) => p.id === permId)
                    return permission ? (
                      <Badge key={permId} variant="secondary" className="text-xs">
                        {permission.label}
                      </Badge>
                    ) : null
                  })}
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              <div className="flex justify-between w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEditingRole(role)}
                  disabled={role.id === "role_4" || role.id === "role_1"} // Prevent editing system roles
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 border-red-200 hover:bg-red-50"
                  onClick={() => handleDeleteRole(role.id)}
                  disabled={role.id === "role_4" || role.id === "role_1" || role.userCount > 0} // Prevent deleting system roles or roles with users
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
