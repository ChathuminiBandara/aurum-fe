import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBBvpIO48zB6cawDYb0gBX_8Po5aCNT2is",
  authDomain: "aurum-knitting.firebaseapp.com",
  projectId: "aurum-knitting",
  storageBucket: "aurum-knitting.firebasestorage.app",
  messagingSenderId: "281212109326",
  appId: "1:281212109326:web:45447576720d68850d725f",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

