// lib/firebaseClient.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBBvpIO48zB6cawDYb0gBX_8Po5aCNT2is",               // Replace with your apiKey
    authDomain: "aurum-knitting.firebaseapp.com",       // Replace with your authDomain
    projectId: "aurum-knitting",           // Your Firebase project ID
    storageBucket: "aurum-knitting.firebasestorage.app",  // Replace with your storageBucket
    messagingSenderId: "281212109326", // Replace with your messagingSenderId
    appId: "1:281212109326:web:45447576720d68850d725f"                   // Replace with your appId
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export default app;
