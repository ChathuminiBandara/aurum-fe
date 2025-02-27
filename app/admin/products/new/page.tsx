"use client"

import type React from "react"

import { useState } from "react"
import { createProduct } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

export default function NewProductPage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [quantity, setQuantity] = useState("")
  const [categoryId, setCategoryId] = useState("")

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createProduct({
        name,
        description,
        price: Number.parseFloat(price),
        imageUrl,
        quantity: Number.parseInt(quantity),
        categoryId: Number.parseInt(categoryId),
      })
      toast.success("Product created successfully")
      router.push("/admin/products")
    } catch (error) {
      toast.error("Failed to create product")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <Textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <Input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
      <Input placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
      <Input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      />
      <Input
        type="number"
        placeholder="Category ID"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        required
      />
      <Button type="submit">Create Product</Button>
    </form>
  )
}

