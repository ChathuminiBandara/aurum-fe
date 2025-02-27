"use client"

import { useEffect, useState } from "react"
import { getProducts } from "@/lib/api"
import ProductCard from "@/components/ProductCard"
import { toast } from "react-hot-toast"

export default function FeaturedProducts() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts({ limit: 3 }) // Assuming the API supports a limit parameter
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
        toast.error("Failed to load featured products")
      }
    }
    fetchProducts()
  }, [])

  return (
    <section className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

