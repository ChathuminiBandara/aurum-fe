"use client"

import { useState, useEffect } from "react"
import { getCustomerOrders } from "@/lib/api"
import { toast } from "react-hot-toast"

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const data = await getCustomerOrders()
      setOrders(data)
    } catch (error) {
      toast.error("Failed to fetch orders")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Order #{order.id}</h2>
              <p className="mb-2">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p className="mb-2">Status: {order.status}</p>
              <p className="mb-4">Total: ${order.total.toFixed(2)}</p>
              <h3 className="text-lg font-semibold mb-2">Items:</h3>
              <ul className="list-disc pl-5">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.name} - Quantity: {item.quantity} - ${item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

