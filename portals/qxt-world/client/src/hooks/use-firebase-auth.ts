import { useState, useEffect } from 'react';
import { 
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  type User as FirebaseUser 
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export function useFirebaseAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Handle redirect result when component mounts
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // The signed-in user info is in result.user
          setUser(result.user);
          toast({
            title: "Success",
            description: "Successfully signed in with Google",
          });
        }
      })
      .catch((error) => {
        setError(error);
        console.error("Redirect sign-in error:", error);
        toast({
          title: "Error",
          description: "Failed to sign in with Google",
          variant: "destructive",
        });
      });

    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        console.log("Auth state changed:", user?.email);
        setUser(user);
        setLoading(false);
      },
      (error) => {
        console.error("Auth state change error:", error);
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [toast]);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  };

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut: signOutUser
  };
}