import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAYkh6nR_4qBGiIR8jPywBt-WGMUtmwJXc",
  authDomain: "five28hertz-a83f4.firebaseapp.com",
  projectId: "five28hertz-a83f4",
  storageBucket: "five28hertz-a83f4.appspot.com",
  messagingSenderId: "901627450014",
  appId: "1:901627450014:web:c56e41c9f1f812f787618f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Get the user's ID token
    const token = await result.user.getIdToken();

    // Send token to backend for verification
    const response = await fetch('/api/auth/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate with server');
    }

    return result.user;
  } catch (error: any) {
    console.error("Authentication error:", error);
    throw error;
  }
};

export const signOut = () => auth.signOut();
export { auth };