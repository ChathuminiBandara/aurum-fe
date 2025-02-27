import Image from "next/image"
import { Button } from "@/components/ui/button"
import { addToCart, addFavorite } from "@/lib/api"
import { toast } from "react-hot-toast"
import { Heart } from "lucide-react"

export default function ProductCard({ product }) {
  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, 1)
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Image
        src={product.imageUrl || "/placeholder.svg"}
        alt={product.name}
        width={300}
        height={300}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
        <div className="flex justify-between">
          <Button className="bg-rose-600 hover:bg-rose-700 text-white" onClick={handleAddToCart}>
            Add to Cart
          </Button>
          <Button
            variant="outline"
            className="border-rose-600 text-rose-600 hover:bg-rose-50"
            onClick={handleAddToFavorites}
          >
            <Heart className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

