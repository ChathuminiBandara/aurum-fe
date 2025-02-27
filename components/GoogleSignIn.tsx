import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"
import { FcGoogle } from "react-icons/fc"

export default function GoogleSignIn() {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      toast.success("Signed in with Google successfully")
    } catch (error) {
      toast.error("Failed to sign in with Google")
    }
  }

  return (
    <Button onClick={handleGoogleSignIn} variant="outline" className="w-full">
      <FcGoogle className="mr-2 h-4 w-4" />
      Sign in with Google
    </Button>
  )
}

