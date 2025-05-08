"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, GripVertical, Trash2, Edit } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

export default function ProfileFieldSettings() {
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const [profileFields, setProfileFields] = useState([
    { id: 1, name: "Age", type: "number", required: true, visible: true, filterable: true },
    { id: 2, name: "Height", type: "number", required: false, visible: true, filterable: true },
    { id: 3, name: "Occupation", type: "text", required: true, visible: true, filterable: true },
    { id: 4, name: "Education", type: "select", required: true, visible: true, filterable: true },
    { id: 5, name: "Interests", type: "multi-select", required: true, visible: true, filterable: true },
    { id: 6, name: "About Me", type: "textarea", required: true, visible: true, filterable: false },
    { id: 7, name: "Looking For", type: "text", required: false, visible: true, filterable: true },
  ]);
  
  const [newField, setNewField] = useState({
    name: "",
    type: "text",
    required: false,
    visible: true,
    filterable: false
  });
  
  const addField = () => {
    setProfileFields([
      ...profileFields,
      {
        id: profileFields.length + 1,
        ...newField
      }
    ]);
    setNewField({
      name: "",
      type: "text",
      required: false,
      visible: true,
      filterable: false
    });
    setIsAddFieldOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profile Fields</CardTitle>
              <CardDescription>
                Manage the fields that appear on user profiles
              </CardDescription>
            </div>
            <Dialog open={isAddFieldOpen} onOpenChange={setIsAddFieldOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Field
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Profile Field</DialogTitle>
                  <DialogDescription>
                    Create a new field for user profiles
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="field-name">Field Name</Label>
                    <Input 
                      id="field-name" 
                      value={newField.name}
                      onChange={(e) => setNewField({...newField, name: e.target.value})}
                      placeholder="e.g. Favorite Movie"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="field-type">Field Type</Label>
                    <Select 
                      value={newField.type}
                      onValueChange={(value) => setNewField({...newField, type: value})}
                    >
                      <SelectTrigger id="field-type">
                        <SelectValue placeholder="Select field type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="select">Single Select</SelectItem>
                        <SelectItem value="multi-select">Multi Select</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="textarea">Text Area</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="field-required"
                      checked={newField.required}
                      onCheckedChange={(checked) => 
                        setNewField({...newField, required: checked === true})
                      }
                    />
                    <Label htmlFor="field-required">Required Field</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="field-visible"
                      checked={newField.visible}
                      onCheckedChange={(checked) => 
                        setNewField({...newField, visible: checked === true})
                      }
                    />
                    <Label htmlFor="field-visible">Visible to Other Users</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="field-filterable"
                      checked={newField.filterable}
                      onCheckedChange={(checked) => 
                        setNewField({...newField, filterable: checked === true})
                      }
                    />
                    <Label htmlFor="field-filterable">Filterable in Search</Label>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddFieldOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addField}>Add Field</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Field Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-center">Required</TableHead>
                <TableHead className="text-center">Visible</TableHead>
                <TableHead className="text-center">Filterable</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profileFields.map((field) => (
                <TableRow key={field.id}>
                  <TableCell>
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                  </TableCell>
                  <TableCell className="font-medium">{field.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{field.type}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {field.required ? "Yes" : "No"}
                  </TableCell>
                  <TableCell className="text-center">
                    {field.visible ? "Yes" : "No"}
                  </TableCell>
                  <TableCell className="text-center">
                    {field.filterable ? "Yes" : "No"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            {profileFields.length} fields configured
          </p>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile Categories</CardTitle>
          <CardDescription>
            Organize profile fields into categories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Basic Information</Label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-md">
              <Badge>Age</Badge>
              <Badge>Height</Badge>
              <Badge>Location</Badge>
              <Badge className="bg-muted text-muted-foreground hover:bg-muted">
                <PlusCircle className="mr-1 h-3 w-3" />
                Add Field
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Career & Education</Label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-md">
              <Badge>Occupation</Badge>
              <Badge>Education</Badge>
              <Badge className="bg-muted text-muted-foreground hover:bg-muted">
                <PlusCircle className="mr-1 h-3 w-3" />
                Add Field
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Lifestyle</Label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-md">
              &lt;!-- Lifestyle fields will go here --&gt;
            </div>
          </div>
          \
