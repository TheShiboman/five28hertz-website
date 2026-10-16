import { getAuth, GoogleAuthProvider, updateProfile } from "firebase/auth";
import app from "./firebase-config";

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider with proper configuration
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { updateProfile };
export default app;