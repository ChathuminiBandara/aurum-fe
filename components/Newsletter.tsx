import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Newsletter() {
  return (
    <section className="bg-rose-100 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
        <p className="text-gray-600 mb-8">Stay updated with our latest products and offers</p>
        <form className="max-w-md mx-auto flex">
          <Input type="email" placeholder="Enter your email" className="flex-grow" />
          <Button type="submit" className="ml-2 bg-rose-600 hover:bg-rose-700 text-white">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  )
}

