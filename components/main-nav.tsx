"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User } from "lucide-react"

export function MainNav() {
    const pathname = usePathname()

    return (
        <div className="mr-4 hidden md:flex px-10 fixed top-0 w-full p-3 z-10 bg-black justify-between">
            <Link href="/" className="mr-6 flex items-center space-x-2">
                <span className="hidden font-bold sm:inline-block">Aurum Knitting</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm">
                <Link
                    href="/"
                    className={cn(
                        "transition-colors hover:text-foreground/80",
                        pathname === "/" ? "text-foreground" : "text-foreground/60",
                    )}
                >
                    Shop
                </Link>
                <Link
                    href="/my-orders"
                    className={cn(
                        "transition-colors hover:text-foreground/80",
                        pathname?.startsWith("/orders") ? "text-foreground" : "text-foreground/60",
                    )}
                >
                    Orders
                </Link>
                <Link
                    href="/cart"
                    className={cn(
                        "transition-colors hover:text-foreground/80",
                        pathname === "/cart" ? "text-foreground" : "text-foreground/60",
                    )}
                >
                    <ShoppingCart className="h-4 w-4" />
                </Link>
                <Link href="/login">
                    <Button variant="ghost" size="icon">
                        <User className="h-4 w-4" />
                    </Button>
                </Link>
            </nav>
        </div>
    )
}

