"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "@/lib/firebaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { Icons } from "@/components/ui/icons"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {useToast} from "@/hooks/use-toast";
// import { useToast } from "@/components/ui/use-toast"

export default function SignUpPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [email, setEmail] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")
    const [confirmPassword, setConfirmPassword] = React.useState<string>("")

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

        if (password !== confirmPassword) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Passwords do not match. Please try again.",
            })
            setIsLoading(false)
            return
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const token = await userCredential.user.getIdToken()
            localStorage.setItem("token", token)
            await upsertUser(token)
            router.push("/")
            toast({
                title: "Account created",
                description: "You have successfully signed up.",
            })
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to create account. Please try again.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    async function onGoogleSignUp() {
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
                description: "You have successfully signed up with Google.",
            })
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Could not sign up with Google. Please try again.",
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
                            &ldquo;Join our community of knitting enthusiasts and discover the joy of handcrafted flowers. Sign up now
                            to start your creative journey with Knitted Blooms.&rdquo;
                        </p>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create an account</CardTitle>
                            <CardDescription>Sign up to get started with Knitted Blooms</CardDescription>
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
                                    <div className="grid gap-2">
                                        <Label htmlFor="confirm-password">Confirm Password</Label>
                                        <Input
                                            id="confirm-password"
                                            type="password"
                                            disabled={isLoading}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                    <Button disabled={isLoading}>
                                        {/*{isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}*/}
                                        Sign Up
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
                            <Button variant="outline" type="button" disabled={isLoading} className="w-full" onClick={onGoogleSignUp}>
                                {isLoading ? (
                                    <span>Loading...</span>
                                ) : (
                                    <span>G</span>
                                )}
                                Google
                            </Button>
                        </CardContent>
                        <CardFooter>
                            <p className="px-8 text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Button variant="link" className="underline" asChild>
                                    <a href="/login">Sign in</a>
                                </Button>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

