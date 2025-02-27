"use client"

import Link from "next/link"
import { ShoppingCart, Heart, User, ChevronDown } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export default function Header() {
  const { user } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem("token")
      toast.success("Signed out successfully")
    } catch (error) {
      toast.error("Failed to sign out")
    }
  }

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          Aurum Knitting
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/products" className="text-gray-600 hover:text-gray-900">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/cart" className="text-gray-600 hover:text-gray-900">
            <ShoppingCart className="h-6 w-6" />
          </Link>
          <Link href="/favorites" className="text-gray-600 hover:text-gray-900">
            <Heart className="h-6 w-6" />
          </Link>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  <User className="h-6 w-6" />
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="text-gray-600 hover:text-gray-900">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-orders" className="text-gray-600 hover:text-gray-900">
                    Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="text-gray-600 hover:text-gray-900">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              <User className="h-6 w-6" />
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

