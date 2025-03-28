import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { signInWithGoogle } from "@/lib/firebase";
import { FcGoogle } from "react-icons/fc";

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      toast({
        title: "Success!",
        description: "You've successfully signed in.",
      });
      setLocation("/");
    } catch (error) {
      console.error("Error signing in:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to sign in. Please try again.";

      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-playfair">Join Five28hertz</CardTitle>
              <CardDescription>
                Sign up to collaborate and stay updated with our latest projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="animate-pulse">Signing in...</span>
                  ) : (
                    <>
                      <FcGoogle className="mr-2 h-5 w-5" />
                      Continue with Google
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;