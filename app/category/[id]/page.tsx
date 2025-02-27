"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getProducts } from "@/lib/api"
import ProductCard from "@/components/ProductCard"
import { toast } from "react-hot-toast"

export default function CategoryPage() {
  const { id } = useParams()
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts({ categoryId: Number(id) })
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
        toast.error("Failed to load products")
      }
    }
    fetchProducts()
  }, [id])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Category Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

