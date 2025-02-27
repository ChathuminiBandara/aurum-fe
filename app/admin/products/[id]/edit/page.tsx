"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getProductById, updateProduct } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-hot-toast"
import { Upload, Loader2 } from "lucide-react"
import Image from "next/image"

export default function EditProductPage() {
  const { id } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    quantity: "",
    categoryId: "",
  })
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(Number(id))
        setProduct(data)
        // Set the existing image URL as preview
        if (data.imageUrl) {
          setPreviewUrl(data.imageUrl)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        toast.error("Failed to load product")
      }
    }
    fetchProduct()
  }, [id])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setImageFile(file)

      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)

      // Cleanup preview URL when component unmounts
      return () => URL.revokeObjectURL(url)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProduct((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = product.imageUrl

      if (imageFile) {
        if (!token) {
          toast.error("Please login as admin")
          return
        }

        // Request a pre-signed URL for S3 upload
        const signRes = await fetch('http://localhost:5000/api/s3/sign', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            fileName: imageFile.name,
            fileType: imageFile.type
          })
        })

        const signData = await signRes.json()
        if (!signRes.ok) {
          throw new Error(signData.error || "Failed to get pre-signed URL")
        }

        const { url: presignedUrl, key: fileKey } = signData

        // Upload the file to S3
        const uploadRes = await fetch(presignedUrl, {
          method: 'PUT',
          headers: { 'Content-Type': imageFile.type },
          body: imageFile
        })

        if (!uploadRes.ok) {
          throw new Error("Failed to upload image to S3")
        }

        imageUrl = `https://aurum-knitting.s3.us-east-1.amazonaws.com/${fileKey}`
      }

      // Update product with new data
      await updateProduct(Number(id), {
        ...product,
        price: Number(product.price),
        quantity: Number(product.quantity),
        categoryId: Number(product.categoryId),
        imageUrl
      })

      toast.success("Product updated successfully")
      router.push("/admin/products")
    } catch (error: any) {
      console.error("Error updating product:", error)
      toast.error(error.message || "Failed to update product")
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input name="name" placeholder="Product Name" value={product.name} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
                name="description"
                placeholder="Description"
                value={product.description}
                onChange={handleChange}
                required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <Input
                  name="price"
                  type="number"
                  placeholder="Price"
                  value={product.price}
                  onChange={handleChange}
                  required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Input
                  name="quantity"
                  type="number"
                  placeholder="Quantity"
                  value={product.quantity}
                  onChange={handleChange}
                  required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category ID</label>
            <Input
                name="categoryId"
                type="number"
                placeholder="Category ID"
                value={product.categoryId}
                onChange={handleChange}
                required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Product Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-gray-300">
              <div className="space-y-1 text-center">
                {previewUrl ? (
                    <div className="mb-4">
                      <Image
                          src={previewUrl}
                          alt="Preview"
                          width={128}
                          height={128}
                          className="mx-auto object-cover rounded-md"
                      />
                    </div>
                ) : (
                    <Upload
                        className="mx-auto h-12 w-12 text-gray-400"
                        strokeWidth={1}
                    />
                )}
                <div className="flex text-sm text-gray-600">
                  <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                  >
                    <span>Upload a file</span>
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>

          <Button
              type="submit"
              className="w-full"
              disabled={loading}
          >
            {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Product...
                </>
            ) : (
                'Update Product'
            )}
          </Button>
        </form>
      </div>
  )
}
