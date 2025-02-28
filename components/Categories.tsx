"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getCategories } from "@/lib/api"
import { toast } from "react-hot-toast"
import { ArrowRight, Leaf, Palette, Sparkles, Star } from "lucide-react"

// Map of category names to icons
const categoryIcons: Record<string, any> = {
  "Flowers": Sparkles,
  "Accessories": Star,
  "Home Decor": Leaf,
  "Seasonal": Palette,
  // Add more mappings as needed
}

// Function to get a default icon if none is mapped
const getIconForCategory = (categoryName: string) => {
  const DefaultIcon = Star
  const IconComponent = categoryIcons[categoryName] || DefaultIcon
  return IconComponent
}

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([])
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast.error("Failed to load categories")
      }
    }
    fetchCategories()
  }, [])

  return (
      <section className="py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">Shop by Category</h2>
            <div className="w-24 h-1 bg-primary/30 rounded-full"></div>
            <p className="mt-4 text-muted-foreground text-center max-w-xl">
              Explore our handcrafted collections, each piece made with care and attention to detail
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const IconComponent = getIconForCategory(category.name)
              const isHovered = hoveredCategory === category.id

              return (
                  <Link
                      key={category.id}
                      href={`/category/${category.id}`}
                      className="group"
                      onMouseEnter={() => setHoveredCategory(category.id)}
                      onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <div className="relative h-full bg-card rounded-xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md border border-border/50 hover:border-primary/20">
                      <div className="p-8 flex flex-col h-full">
                        <div className={`p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 transition-all duration-300 ${
                            isHovered ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                        }`}>
                          <IconComponent className="w-8 h-8" />
                        </div>

                        <h3 className="text-xl font-semibold mb-2">{category.name}</h3>

                        <p className="text-muted-foreground mb-6 flex-grow">
                          {category.description || `Explore our collection of handcrafted ${category.name.toLowerCase()}`}
                        </p>

                        <div className="flex items-center text-sm font-medium text-primary">
                          <span className="mr-2">Browse collection</span>
                          <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${
                              isHovered ? 'translate-x-1' : ''
                          }`} />
                        </div>
                      </div>

                      <div className={`absolute bottom-0 left-0 h-1 bg-primary transition-all duration-300 ${
                          isHovered ? 'w-full' : 'w-0'
                      }`}></div>
                    </div>
                  </Link>
              )
            })}
          </div>
        </div>
      </section>
  )
}
