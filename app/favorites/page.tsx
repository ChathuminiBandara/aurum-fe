"use client"

import { useState, useEffect } from "react"
import { getFavorites, removeFavorite } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"
import Image from "next/image"
import Link from "next/link"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      const data = await getFavorites()
      setFavorites(data)
    } catch (error) {
      toast.error("Failed to fetch favorites")
    }
  }

  const handleRemoveFavorite = async (favoriteId: number) => {
    try {
      await removeFavorite(favoriteId)
      fetchFavorites()
      toast.success("Removed from favorites")
    } catch (error) {
      toast.error("Failed to remove from favorites")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Favorites</h1>
      {favorites.length === 0 ? (
        <p>You haven't added any favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((favorite) => (
            <div key={favorite.id} className="border rounded-lg p-4">
              <Image
                src={favorite.product.imageUrl || "/placeholder.svg"}
                alt={favorite.product.name}
                width={200}
                height={200}
                className="mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{favorite.product.name}</h2>
              <p className="mb-4">${favorite.product.price.toFixed(2)}</p>
              <div className="flex justify-between">
                <Link href={`/products/${favorite.product.id}`}>
                  <Button variant="outline">View Product</Button>
                </Link>
                <Button variant="destructive" onClick={() => handleRemoveFavorite(favorite.id)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

