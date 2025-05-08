"use client"

import { useState } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { CategoryManager } from "@/components/admin/category-manager"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Compass, Users } from "lucide-react"

export default function CategoriesPage() {
  // Mock data for categories
  const [exploreCategories, setExploreCategories] = useState([
    { id: "e1", name: "Dating", description: "Find potential romantic partners", active: true, order: 1 },
    { id: "e2", name: "Friendship", description: "Connect with like-minded individuals", active: true, order: 2 },
    { id: "e3", name: "Professional", description: "Expand your professional network", active: true, order: 3 },
    { id: "e4", name: "Events", description: "Local events and gatherings", active: false, order: 4 },
    { id: "e5", name: "Travel Buddies", description: "Find companions for your adventures", active: true, order: 5 },
  ])

  const [clubCategories, setClubCategories] = useState([
    { id: "c1", name: "Sports", description: "Sports and fitness enthusiasts", active: true, order: 1 },
    { id: "c2", name: "Arts & Culture", description: "Art, music, and cultural experiences", active: true, order: 2 },
    { id: "c3", name: "Food & Drinks", description: "Culinary experiences and beverages", active: true, order: 3 },
    { id: "c4", name: "Tech", description: "Technology and innovation", active: false, order: 4 },
    { id: "c5", name: "Outdoors", description: "Nature and outdoor activities", active: true, order: 5 },
    { id: "c6", name: "Languages", description: "Language exchange and learning", active: true, order: 6 },
  ])

  return (
    <div className="space-y-6">
      <AdminHeader title="Category Management" description="Manage explore and club categories" />

      <Card className="p-4">
        <Tabs defaultValue="explore" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="explore" className="flex items-center">
              <Compass className="mr-2 h-4 w-4" />
              Explore Categories
            </TabsTrigger>
            <TabsTrigger value="clubs" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Club Categories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="explore">
            <CategoryManager categories={exploreCategories} onUpdate={setExploreCategories} type="explore" />
          </TabsContent>

          <TabsContent value="clubs">
            <CategoryManager categories={clubCategories} onUpdate={setClubCategories} type="clubs" />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
