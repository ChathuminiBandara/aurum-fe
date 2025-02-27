"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { getCategories } from "@/lib/api"
import { toast } from "react-hot-toast"

export default function Categories() {
  const [categories, setCategories] = useState([])

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
    <section className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link key={category.id} href={`/category/${category.id}`} className="group">
            <div className="relative h-48 rounded-lg overflow-hidden">
              <Image
                src={category.imageUrl || "/placeholder.svg"}
                alt={category.name}
                layout="fill"
                objectFit="cover"
                className="group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-xl font-semibold">{category.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

