"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Flower } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [email, setEmail] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")

    async function upsertUser(token: string) {
        try {
            const res = await fetch("http://54.179.39.154:5000/api/customers/upsert", {
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
        <div className="container flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 min-h-screen fixed top-0 bg-background">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="https://aurum-knitting.s3.us-east-1.amazonaws.com/mobile/green.jpg"
                        alt="Knitted flowers"
                        className="object-cover w-full h-full opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/20 mix-blend-multiply" />
                </div>
                <div className="relative z-20 flex items-center text-lg font-medium p-10">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                        <Flower className="h-6 w-6 text-white" />
                        <span className="text-xl font-semibold tracking-tight">Aurum Knitting</span>
                    </div>
                </div>
                <div className="relative z-20 mt-auto p-10">
                    <blockquote className="space-y-2 backdrop-blur-sm bg-white/10 p-6 rounded-lg border border-white/20">
                        <p className="text-lg font-light italic">
                            &ldquo;Discover the beauty of handcrafted knitted flowers, where each piece tells a unique story of
                            artistry and dedication.&rdquo;
                        </p>
                        <footer className="text-sm font-medium mt-4">— Aurum Knitting</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8 flex items-center justify-center">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
                    <div className="flex flex-col space-y-2 text-center mb-4 lg:hidden">
                        <div className="flex justify-center mb-2">
                            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                                <Flower className="h-5 w-5 text-primary" />
                                <span className="text-xl font-semibold tracking-tight">Aurum Knitting</span>
                            </div>
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                        <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
                    </div>

                    <Card className="border-none shadow-lg">
                        <CardHeader className="space-y-1 lg:block hidden">
                            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                            <CardDescription>Sign in to your account to continue</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={onSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
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
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                            <Button variant="link" className="px-0 font-normal text-xs h-auto" asChild>
                                                <a href="/forgot-password">Forgot password?</a>
                                            </Button>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            disabled={isLoading}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-11"
                                        />
                                    </div>
                                    <Button disabled={isLoading} className="w-full h-11 font-medium">
                                        {isLoading ? "Signing in..." : "Sign In"}
                                    </Button>
                                </div>
                            </form>
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <Separator />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                type="button"
                                disabled={isLoading}
                                className="w-full h-11 font-medium flex items-center gap-2"
                                onClick={onGoogleSignIn}
                            >
                                {isLoading ? (
                                    <span>Loading...</span>
                                ) : (
                                    <>
                                        <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                                            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                                                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                                                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                                                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                                            </g>
                                        </svg>
                                        <span>Sign in with Google</span>
                                    </>
                                )}
                            </Button>
                        </CardContent>
                        <CardFooter className="flex flex-col">
                            <p className="text-center text-sm text-muted-foreground mt-4">
                                Don&apos;t have an account?{" "}
                                <Button variant="link" className="p-0 h-auto font-normal" asChild>
                                    <a href="/signup">Sign up</a>
                                </Button>
                            </p>
                            <p className="text-center text-xs text-muted-foreground mt-6">
                                By continuing, you agree to our{" "}
                                <a href="/terms" className="underline underline-offset-4 hover:text-primary">
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
                                    Privacy Policy
                                </a>
                                .
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
