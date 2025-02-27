"use client"

import { useState, useEffect } from "react"
import { getCart } from "@/lib/api"

export function useCart() {
  const [cartItems, setCartItems] = useState([])
  const [cartItemsCount, setCartItemsCount] = useState(0)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart()
        setCartItems(data)
        setCartItemsCount(data.reduce((total, item) => total + item.quantity, 0))
      } catch (error) {
        console.error("Error fetching cart:", error)
      }
    }
    fetchCart()
  }, [])

  return { cartItems, cartItemsCount }
}

