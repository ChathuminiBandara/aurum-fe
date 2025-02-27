import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <div className="relative h-[600px] overflow-hidden">
      <Image
        src="https://images.pexels.com/photos/6634339/pexels-photo-6634339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        alt="Knitted flowers arrangement"
        layout="fill"
        objectFit="cover"
        className="brightness-50"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Handcrafted Knitted Flowers</h1>
          <p className="text-xl mb-8">Unique, beautiful, and made with love</p>
          <Button size="lg" className="bg-rose-600 hover:bg-rose-700 text-white">
            Shop Now
          </Button>
        </div>
      </div>
    </div>
  )
}

