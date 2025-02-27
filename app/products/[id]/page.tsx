"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getProductById, addToCart, addFavorite } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"
import Image from "next/image"
import { Heart } from "lucide-react"
import ReviewList from "@/components/ReviewList"
import ReviewForm from "@/components/ReviewForm"

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(Number(id))
        setProduct(data)
      } catch (error) {
        console.error("Error fetching product:", error)
        toast.error("Failed to load product")
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity)
      toast.success("Added to cart")
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to add to cart")
    }
  }

  const handleAddToFavorites = async () => {
    try {
      await addFavorite(product.id)
      toast.success("Added to favorites")
    } catch (error) {
      console.error("Error adding to favorites:", error)
      toast.error("Failed to add to favorites")
    }
  }

  if (!product) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Image
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.name}
            width={500}
            height={500}
            className="rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-xl mb-4">${product.price.toFixed(2)}</p>
          <p className="mb-4">{product.description}</p>
          <div className="flex items-center space-x-4 mb-4">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border rounded px-2 py-1 w-16"
            />
            <Button onClick={handleAddToCart}>Add to Cart</Button>
            <Button variant="outline" onClick={handleAddToFavorites}>
              <Heart className="mr-2 h-4 w-4" /> Add to Favorites
            </Button>
          </div>
        </div>
      </div>
      <ReviewList productId={product.id} />
      <ReviewForm productId={product.id} />
    </div>
  )
}

