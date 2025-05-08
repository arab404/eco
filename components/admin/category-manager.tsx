"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { GripVertical, Plus, Trash2, Pencil } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Category {
  id: string
  name: string
  description: string
  active: boolean
  order: number
}

interface CategoryManagerProps {
  categories: Category[]
  onUpdate: (categories: Category[]) => void
  type: string
}

export function CategoryManager({ categories, onUpdate, type }: CategoryManagerProps) {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState<Omit<Category, "id" | "order">>({
    name: "",
    description: "",
    active: true,
  })

  // Handle drag end
  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(categories)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update order
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1,
    }))

    onUpdate(updatedItems)

    toast({
      title: "Categories reordered",
      description: "The category order has been updated.",
    })
  }

  // Handle toggling active status
  const handleToggleActive = (id: string, active: boolean) => {
    const updatedCategories = categories.map((category) => (category.id === id ? { ...category, active } : category))

    onUpdate(updatedCategories)

    toast({
      title: active ? "Category activated" : "Category deactivated",
      description: `The category has been ${active ? "activated" : "deactivated"}.`,
    })
  }

  // Handle opening the add/edit dialog
  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        description: category.description,
        active: category.active,
      })
    } else {
      setEditingCategory(null)
      setFormData({
        name: "",
        description: "",
        active: true,
      })
    }

    setIsDialogOpen(true)
  }

  // Handle saving category
  const handleSaveCategory = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required.",
        variant: "destructive",
      })
      return
    }

    if (editingCategory) {
      // Update existing category
      const updatedCategories = categories.map((category) =>
        category.id === editingCategory.id ? { ...category, ...formData } : category,
      )

      onUpdate(updatedCategories)

      toast({
        title: "Category updated",
        description: "The category has been updated successfully.",
      })
    } else {
      // Add new category
      const newCategory: Category = {
        id: `${type}-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        active: formData.active,
        order: categories.length + 1,
      }

      onUpdate([...categories, newCategory])

      toast({
        title: "Category added",
        description: "The new category has been added successfully.",
      })
    }

    setIsDialogOpen(false)
  }

  // Handle deleting category
  const handleDeleteCategory = (id: string) => {
    const updatedCategories = categories
      .filter((category) => category.id !== id)
      .map((category, index) => ({
        ...category,
        order: index + 1,
      }))

    onUpdate(updatedCategories)

    toast({
      title: "Category deleted",
      description: "The category has been deleted successfully.",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{type === "explore" ? "Explore Categories" : "Club Categories"}</h3>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="categories">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-1">
              {categories.map((category, index) => (
                <Draggable key={category.id} draggableId={category.id} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} className="bg-white rounded-md border">
                      <div className="flex items-center p-2">
                        <div {...provided.dragHandleProps} className="px-2 cursor-grab">
                          <GripVertical className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-gray-500 truncate">{category.description}</div>
                        </div>
                        <div className="flex items-center gap-3 px-2">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={category.active}
                              onCheckedChange={(checked) => handleToggleActive(category.id, checked)}
                              id={`active-${category.id}`}
                            />
                            <Badge className={category.active ? "bg-green-500" : "bg-gray-400"}>
                              {category.active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(category)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the "{category.name}" category. This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}

              {categories.length === 0 && (
                <div className="text-center py-10 border rounded-md bg-gray-50">
                  <p className="text-gray-500">No categories found. Add one to get started.</p>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add/Edit Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="categoryName" className="text-sm font-medium">
                Category Name
              </label>
              <Input
                id="categoryName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="categoryDescription" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="categoryDescription"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter category description"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="categoryActive"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
              <label htmlFor="categoryActive" className="text-sm font-medium">
                Active
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCategory}>{editingCategory ? "Save Changes" : "Add Category"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
