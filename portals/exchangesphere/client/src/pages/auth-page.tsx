import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { insertUserSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Gift } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const registerSchema = insertUserSchema
  .extend({
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const { loginMutation, registerMutation, user } = useAuth();
  const [location, navigate] = useLocation();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralValid, setReferralValid] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  
  // Parse URL parameters for referral code and set the active tab to register
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferralCode(ref);
      validateReferralCode(ref);
      setActiveTab("register"); // Auto-switch to registration tab when referral code is present
    }
  }, []);
  
  // Validate the referral code
  const validateReferralCode = async (code: string) => {
    setIsValidating(true);
    try {
      const response = await fetch(`/api/referral/validate?code=${code}`);
      if (response.ok) {
        setReferralValid(true);
      } else {
        setReferralValid(false);
      }
    } catch (error) {
      console.error('Error validating referral code:', error);
      setReferralValid(false);
    } finally {
      setIsValidating(false);
    }
  };
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      fullName: "",
      password: "",
      confirmPassword: "",
      location: "",  // Empty string instead of null
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    const { confirmPassword, ...registerData } = data;
    
    // If we have a valid referral code, set the active tab to register
    if (referralCode && referralValid) {
      registerMutation.mutate(registerData, {
        onSuccess: () => {
          // After successful registration, register the referral
          fetch('/api/referral/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: referralCode }),
          }).catch(err => console.error("Failed to register referral:", err));
        }
      });
    } else {
      registerMutation.mutate(registerData);
    }
  };

  // Redirect if user is already logged in
  if (user) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Column - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Logo size="lg" withText={false} />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome to ExchangeSphere</CardTitle>
            <CardDescription>
              Share skills, fulfill dreams, build connections
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {referralCode && (
              <div className="mb-4">
                {isValidating ? (
                  <div className="flex items-center p-3 rounded-md bg-muted">
                    <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
                    <p className="text-sm">Validating referral code...</p>
                  </div>
                ) : referralValid ? (
                  <div className="flex items-center p-3 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50 text-green-700 dark:text-green-400">
                    <Gift className="h-4 w-4 mr-2" />
                    <div>
                      <p className="text-sm font-medium">Valid Referral Code</p>
                      <p className="text-xs">Register to claim your welcome bonus!</p>
                    </div>
                  </div>
                ) : referralValid === false ? (
                  <div className="flex items-center p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 text-red-700 dark:text-red-400">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <p className="text-sm">Invalid or expired referral code.</p>
                  </div>
                ) : null}
              </div>
            )}
            
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Choose a username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Your email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="City, Country (optional)" 
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              value={field.value || ''}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Create a password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirm your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Hero Section */}
      <div className="flex-1 bg-gradient-to-br from-primary to-secondary p-12 flex flex-col justify-center text-white lg:block hidden">
        <div className="max-w-lg">
          <h1 className="text-4xl font-bold mb-6">A Connected World</h1>
          <p className="text-xl mb-8">
            Exchange skills, fulfill your bucket list, and build meaningful connections with people around the world.
          </p>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-white/20 p-2 rounded-full mr-4">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Share Your Skills</h3>
                <p className="text-white/80">Offer your expertise and help others learn and grow</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-white/20 p-2 rounded-full mr-4">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Fulfill Your Bucket List</h3>
                <p className="text-white/80">Turn your dreams into reality through meaningful exchanges</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-white/20 p-2 rounded-full mr-4">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Global Community</h3>
                <p className="text-white/80">Connect with like-minded people from around the world</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
