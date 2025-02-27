"use client"

import { useState } from "react"
import SignIn from "@/components/SignIn"
import SignUp from "@/components/SignUp"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="p-8 bg-white shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {isSignIn ? "Sign in to your account" : "Create a new account"}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isSignIn ? "Enter your details to access your account" : "Fill in your information to get started"}
            </p>
          </div>

          {isSignIn ? <SignIn /> : <SignUp />}

          <div className="mt-6 text-center">
            <Button variant="link" onClick={() => setIsSignIn(!isSignIn)} className="text-gray-600 hover:text-gray-900">
              {isSignIn ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

