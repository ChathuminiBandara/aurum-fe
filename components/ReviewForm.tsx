"use client"

import type React from "react"

import { useState } from "react"
import { createReview } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-hot-toast"
import { Star } from "lucide-react"

export default function ReviewForm({ productId }) {
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createReview({ productId, rating, reviewText })
      toast.success("Review submitted successfully")
      setRating(0)
      setReviewText("")
    } catch (error) {
      console.error("Error submitting review:", error)
      toast.error("Failed to submit review")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Write a Review</h2>
      <div className="flex items-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`cursor-pointer ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
      <Textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Write your review here..."
        className="mb-4"
        required
      />
      <Button type="submit">Submit Review</Button>
    </form>
  )
}

