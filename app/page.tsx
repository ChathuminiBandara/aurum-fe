import Hero from "@/components/Hero"
import FeaturedProducts from "@/components/FeaturedProducts"
import Categories from "@/components/Categories"
import Newsletter from "@/components/Newsletter"
import { Flower } from "lucide-react"

export default function Home() {
  return (
    <div className="space-y-16 py-8">
      <Hero />
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center">
          <Flower className="mr-2 flower-bloom" />
          Welcome to Blooming Knits
          <Flower className="ml-2 flower-bloom" />
        </h2>
        <p className="text-center text-lg mb-8">Discover our handcrafted knitted flowers, perfect for any occasion.</p>
      </div>
      <FeaturedProducts />
      <Categories />
      <Newsletter />
    </div>
  )
}

