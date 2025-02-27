"use client"

import { useState, useEffect } from "react"
import { getFavorites } from "@/lib/api"

export function useFavorites() {
  const [favorites, setFavorites] = useState([])
  const [favoritesCount, setFavoritesCount] = useState(0)

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await getFavorites()
        setFavorites(data)
        setFavoritesCount(data.length)
      } catch (error) {
        console.error("Error fetching favorites:", error)
      }
    }
    fetchFavorites()
  }, [])

  return { favorites, favoritesCount }
}

