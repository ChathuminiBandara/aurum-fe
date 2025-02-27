"use client"

import { useState, useEffect } from "react"
import { getCart, updateCartItem, removeCartItem, createCheckoutSession } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "react-hot-toast"
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth"
import { Package } from "lucide-react"

type CartItem = {
  id: number
  quantity: number
  product: {
    id: number
    name: string
    price: number
    imageUrl: string
    description: string
  }
}

type Cart = {
  id: number
  customerId: number
  items: CartItem[]
  createdAt: string
  updatedAt: string
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const data = await getCart()
      setCart(data)
    } catch (error) {
      toast.error("Failed to fetch cart")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    try {
      await updateCartItem(itemId, quantity)
      fetchCart()
      toast.success("Quantity updated")
    } catch (error) {
      toast.error("Failed to update quantity")
    }
  }

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeCartItem(itemId)
      fetchCart()
      toast.success("Item removed from cart")
    } catch (error) {
      toast.error("Failed to remove item")
    }
  }

  const handleCheckout = async () => {
    if (!cart?.items) return

    try {
      const session = await createCheckoutSession(
          cart.items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          }))
      )
      window.location.href = session.url
    } catch (error) {
      toast.error("Failed to create checkout session")
    }
  }

  const total = cart?.items?.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
  ) ?? 0

  if (loading || authLoading) {
    return (
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    )
  }

  if (!user) {
    return (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
            <p className="text-gray-600">You need to be signed in to view your cart</p>
          </div>
        </div>
    )
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {!cart?.items?.length ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
              <p className="mt-1 text-sm text-gray-500">Add some products to your cart to get started.</p>
            </div>
        ) : (
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow">
                {cart.items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between p-6 border-b last:border-b-0"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative h-20 w-20 flex-shrink-0">
                          {item.product.imageUrl ? (
                              <Image
                                  src={item.product.imageUrl}
                                  alt={item.product.name}
                                  fill
                                  className="rounded-md object-cover"
                              />
                          ) : (
                              <div className="h-20 w-20 rounded-md bg-gray-100 flex items-center justify-center">
                                <Package className="h-8 w-8 text-gray-400" />
                              </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{item.product.name}</h3>
                          <p className="text-gray-600">${(item.product.price / 100).toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-24">
                          <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value))}
                              min="1"
                              className="text-center"
                          />
                        </div>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                ))}
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-2xl font-bold">${(total / 100).toFixed(2)}</span>
                </div>
                <Button
                    onClick={handleCheckout}
                    className="w-full"
                    size="lg"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
        )}
      </div>
  )
}
