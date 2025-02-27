"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { getCustomerProfile, updateCustomerProfile } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "react-hot-toast"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { User, Loader2 } from "lucide-react"

type Profile = {
  id: number
  userId: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      console.log("Helloo")
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const data = await getCustomerProfile()
      console.log('Fetched profile data:', data) // Debug log
      setProfile(data)
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Failed to fetch profile")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    try {
      setUpdating(true)
      const updatedData = {
        name: profile.name,
        email: profile.email
      }
      await updateCustomerProfile(updatedData)
      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setUpdating(false)
    }
  }

  if (!user) {
    return (
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <User className="mx-auto h-12 w-12 text-gray-400" />
                <h2 className="mt-2 text-lg font-medium text-gray-900">Sign In Required</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Please sign in to view and manage your profile.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
    )
  }

  if (loading) {
    return (
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    )
  }

  if (!profile) {
    return (
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <User className="mx-auto h-12 w-12 text-gray-400" />
                <h2 className="mt-2 text-lg font-medium text-gray-900">No Profile Found</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Unable to load your profile information.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
    )
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6" />
              Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                    htmlFor="name"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Name
                </label>
                <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, name: e.target.value } : null)}
                    placeholder="Enter your name"
                    disabled={updating}
                    required
                />
              </div>

              <div className="space-y-2">
                <label
                    htmlFor="email"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Email
                </label>
                <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, email: e.target.value } : null)}
                    placeholder="Enter your email"
                    disabled={updating}
                    required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Member since {new Date(profile.createdAt).toLocaleDateString()}
                </div>
                <Button type="submit" disabled={updating}>
                  {updating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                  ) : (
                      "Update Profile"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
  )
}
