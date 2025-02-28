"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ShoppingCart, User } from "lucide-react"

export function MobileNav() {
    const pathname = usePathname()
    const [open, setOpen] = React.useState(false)

    return (
        <div className="flex md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="mr-2">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="pr-0">
                    <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
                        <div className="flex flex-col space-y-4">
                            <Link href="/" onClick={() => setOpen(false)}>
                                <span className="font-bold">Aurum Knitting</span>
                            </Link>
                            <nav className="flex flex-col space-y-3">
                                <Link
                                    href="/"
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        "text-sm transition-colors hover:text-foreground/80",
                                        pathname === "/" ? "text-foreground" : "text-foreground/60",
                                    )}
                                >
                                    Shop
                                </Link>
                                <Link
                                    href="/orders"
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        "text-sm transition-colors hover:text-foreground/80",
                                        pathname?.startsWith("/orders") ? "text-foreground" : "text-foreground/60",
                                    )}
                                >
                                    Orders
                                </Link>
                                <Link
                                    href="/cart"
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        "text-sm transition-colors hover:text-foreground/80",
                                        pathname === "/cart" ? "text-foreground" : "text-foreground/60",
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <ShoppingCart className="h-4 w-4" />
                                        Cart
                                    </div>
                                </Link>
                                <Link
                                    href="/login"
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        "text-sm transition-colors hover:text-foreground/80",
                                        pathname === "/login" ? "text-foreground" : "text-foreground/60",
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Account
                                    </div>
                                </Link>
                            </nav>
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </div>
    )
}

