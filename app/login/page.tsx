"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { Icons } from "@/components/ui/icons"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {useToast} from "@/hooks/use-toast";
// import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [email, setEmail] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")

    async function upsertUser(token: string) {
        try {
            const res = await fetch("http://localhost:5000/api/customers/upsert", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({}),
            })
            if (!res.ok) {
                throw new Error(await res.text())
            }
        } catch (error) {
            console.error("Error upserting user:", error)
            throw error
        }
    }

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault()
        setIsLoading(true)

        try {
            const result = await signInWithEmailAndPassword(auth, email, password)
            const token = await result.user.getIdToken()
            localStorage.setItem("token", token)
            await upsertUser(token)
            router.push("/")
            toast({
                title: "Welcome back!",
                description: "You have successfully signed in.",
            })
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Invalid email or password. Please try again.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    async function onGoogleSignIn() {
        setIsLoading(true)
        const provider = new GoogleAuthProvider()

        try {
            const result = await signInWithPopup(auth, provider)
            const token = await result.user.getIdToken()
            localStorage.setItem("token", token)
            await upsertUser(token)
            router.push("/")
            toast({
                title: "Welcome!",
                description: "You have successfully signed in with Google.",
            })
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not sign in with Google. Please try again.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 min-h-screen">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <img src="/placeholder.svg?height=40&width=40" alt="Knitted Blooms Logo" className="mr-2 h-10 w-10" />
                    Knitted Blooms
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;Discover the beauty of handcrafted knitted flowers, where each piece tells a unique story of
                            artistry and dedication.&rdquo;
                        </p>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome back</CardTitle>
                            <CardDescription>Sign in to your account to continue</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={onSubmit}>
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            placeholder="name@example.com"
                                            type="email"
                                            autoCapitalize="none"
                                            autoComplete="email"
                                            autoCorrect="off"
                                            disabled={isLoading}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            disabled={isLoading}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <Button disabled={isLoading}>
                                        {/*{isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}*/}
                                        Sign In
                                    </Button>
                                </div>
                            </form>
                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <Separator />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                                </div>
                            </div>
                            <Button variant="outline" type="button" disabled={isLoading} className="w-full" onClick={onGoogleSignIn}>
                                {isLoading ? (
                                    // <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                    <span>Loading...</span>
                                ) : (
                                    <span>G</span>
                                )}
                                Google
                            </Button>
                        </CardContent>
                        <CardFooter>
                            <p className="px-8 text-center text-sm text-muted-foreground">
                                Don&apos;t have an account?{" "}
                                <Button variant="link" className="underline" asChild>
                                    <a href="/signup">Sign up</a>
                                </Button>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

