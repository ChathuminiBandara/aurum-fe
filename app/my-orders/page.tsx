"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Package } from "lucide-react"
import {useToast} from "@/hooks/use-toast";

type OrderItem = {
    id: number
    quantity: number
    price: number
    productId: number
}

type Order = {
    id: number
    amount: number
    status: string
    orderItems: OrderItem[]
    createdAt: string
}

const statusColors = {
    pending: "bg-yellow-500",
    processing: "bg-blue-500",
    shipped: "bg-green-500",
    delivered: "bg-green-700",
    cancelled: "bg-red-500",
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { toast } = useToast()
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    useEffect(() => {
        if (!token) {
            router.push("/login")
            return
        }
        fetchOrders()
    }, [token, router])

    const fetchOrders = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/orders", {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            setOrders(data)
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load orders. Please try again.",
            })
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="container flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="container py-8">
                <Card className="flex flex-col items-center justify-center p-8">
                    <Package className="h-12 w-12 text-muted-foreground mb-4" />
                    <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
                    <p className="text-muted-foreground">Start shopping to see your orders here!</p>
                </Card>
            </div>
        )
    }

    return (
        <div className="container py-8">
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">My Orders</h1>
                    <p className="text-muted-foreground">Track and manage your orders</p>
                </div>
                <div className="grid gap-6">
                    {orders.map((order) => (
                        <Card key={order.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Order #{order.id}</CardTitle>
                                        <CardDescription>Placed on {new Date(order.createdAt).toLocaleDateString()}</CardDescription>
                                    </div>
                                    <Badge
                                        className={`${statusColors[order.status.toLowerCase() as keyof typeof statusColors]} text-white`}
                                    >
                                        {order.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product ID</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead className="text-right">Price</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order.orderItems.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.productId}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow>
                                            <TableCell colSpan={2} className="font-semibold">
                                                Total
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">${order.amount.toFixed(2)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

