"use client"

import React, {useEffect} from "react"

import { useAuth } from "@/hooks/useAuth"
import { redirect } from "next/navigation"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()

  useEffect(() => {
    console.log(user)

    if(!loading){
      if (!user || user.role !== "admin") {
        // redirect("/")
      }
    }

  },[user])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }



  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r">
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/admin/products" className="block p-2 hover:bg-gray-100 rounded">
                Products
              </Link>
            </li>
            <li>
              <Link href="/admin/categories" className="block p-2 hover:bg-gray-100 rounded">
                Categories
              </Link>
            </li>
            <li>
              <Link href="/admin/orders" className="block p-2 hover:bg-gray-100 rounded">
                Orders
              </Link>
            </li>
            <li>
              <Link href="/admin/users" className="block p-2 hover:bg-gray-100 rounded">
                Users
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}

