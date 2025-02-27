"use client"

import { useState, useEffect } from "react"
import { getReviewsForProduct } from "@/lib/api"
import { toast } from "react-hot-toast"
import { Star } from "lucide-react"

export default function ReviewList({ productId }: { productId: number }) {
  const [reviews, setReviews] = useState([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const fetchReviews = async () => {
      try {
        const data = await getReviewsForProduct(productId)
        setReviews(data)
      } catch (error) {
        console.error("Error fetching reviews:", error)
        toast.error("Failed to load reviews")
      }
    }
    fetchReviews()
  }, [productId])

  if (!mounted) {
    return null
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"} />
                ))}
              </div>
              <p className="mb-2">{review.reviewText}</p>
              <p className="text-sm text-gray-500">
                By {review.customerName} on {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

