import type React from "react"
import type {Metadata} from "next"
import {Inter} from "next/font/google"
import "./globals.css"
import {Toaster} from "react-hot-toast"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import {AuthProvider} from "@/hooks/useAuth"
import {Provider} from 'react-redux'
import {store} from "@/lib/store";
import Providers from "@/provider/Providers";

const inter = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
    title: "Knitted Flower Shop", description: "Beautiful handcrafted knitted flowers",
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (<html lang="en">
        <body className={`${inter.className} bg-white flex flex-col min-h-screen`}>
        <AuthProvider>
            <Providers>
                <Header/>
                <main className="flex-grow">{children}</main>
                <Footer/>
                <Toaster/>
            </Providers>
        </AuthProvider>
        </body>
        </html>)
}

