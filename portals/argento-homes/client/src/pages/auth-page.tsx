import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Home, Building, User, Key, Leaf } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { UserRole } from "@shared/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AssetLogo } from "@/components/ui/asset-logo";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(2, "Full name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum([UserRole.GUEST, UserRole.PROPERTY_OWNER, UserRole.VENDOR, UserRole.DEVELOPER]),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const AuthPage = () => {
  const { loginMutation, registerMutation, user, isLoading } = useAuth();

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
      role: UserRole.GUEST,
    },
  });

  const onLogin = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegister = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };

  // If auth is still loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen bg-brand-background flex flex-col lg:flex-row">
      {/* Left side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-brand-background">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <AssetLogo variant="large" />
          </div>

          <Card className="border border-brand-border/30 shadow-brand">
            <CardHeader>
              <CardTitle className="text-brand-text text-xl font-poppins">Welcome to Argento Homes</CardTitle>
              <CardDescription className="text-brand-muted">
                Sign in to your account or create a new one to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-brand-card/50">
                  <TabsTrigger value="login" className="data-[state=active]:bg-brand data-[state=active]:text-white">Login</TabsTrigger>
                  <TabsTrigger value="register" className="data-[state=active]:bg-brand data-[state=active]:text-white">Register</TabsTrigger>
                </TabsList>
                
                {/* Login Form */}
                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-2 top-2.5 h-4 w-4 text-brand-muted" />
                                <Input className="pl-8 input-brand" placeholder="Enter your username" {...field} />
                              </div>
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
                              <div className="relative">
                                <Key className="absolute left-2 top-2.5 h-4 w-4 text-brand-muted" />
                                <Input className="pl-8 input-brand" type="password" placeholder="Enter your password" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full btn-brand"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Signing in..." : "Sign In"}
                      </Button>
                      
                      <div className="text-center mt-4">
                        <span className="text-brand-muted">Looking for properties?</span>{" "}
                        <a href="/guest" className="text-brand hover:text-brand-light font-medium">
                          Visit Guest Portal
                        </a>
                      </div>
                    </form>
                  </Form>
                </TabsContent>
                
                {/* Register Form */}
                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-2 top-2.5 h-4 w-4 text-brand-muted" />
                                <Input className="pl-8 input-brand" placeholder="Choose a username" {...field} />
                              </div>
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
                              <Input type="email" className="input-brand" placeholder="Enter your email" {...field} />
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
                              <Input className="input-brand" placeholder="Enter your full name" {...field} />
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
                              <div className="relative">
                                <Key className="absolute left-2 top-2.5 h-4 w-4 text-brand-muted" />
                                <Input className="pl-8 input-brand" type="password" placeholder="Create a password" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-gray-300 focus:border-brand focus:ring-brand input-brand">
                                  <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={UserRole.GUEST} className="focus:bg-brand/10">Guest</SelectItem>
                                <SelectItem value={UserRole.PROPERTY_OWNER} className="focus:bg-brand/10">Property Owner</SelectItem>
                                <SelectItem value={UserRole.VENDOR} className="focus:bg-brand/10">Vendor</SelectItem>
                                <SelectItem value={UserRole.DEVELOPER} className="focus:bg-brand/10">Developer/Investor</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full btn-brand"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                      </Button>
                      
                      <div className="text-center mt-4">
                        <span className="text-brand-muted">Looking for properties?</span>{" "}
                        <a href="/guest" className="text-brand hover:text-brand-light font-medium">
                          Visit Guest Portal
                        </a>
                      </div>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Hero Section */}
      <div className="flex-1 bg-gradient-to-br from-brand-text to-brand-text/90 hidden lg:flex flex-col justify-center p-12 text-white">
        <div className="space-y-6 max-w-md mx-auto">
          <div className="flex justify-center mb-6">
            <AssetLogo variant="large" className="filter brightness-0 invert" />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-3xl font-bold font-poppins">Argento Homes Digital Portal</h2>
            <p className="text-white/90">
              Connect all key stakeholders in the short-term rental ecosystem with our
              seamless, sustainable, and innovative property management platform.
            </p>
          </div>

          <div className="space-y-5 mt-8">
            <div className="flex items-start space-x-4 bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/10 shadow-xl">
              <div className="mt-1 rounded-full bg-brand p-2.5 shadow-lg">
                <Home size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-medium font-poppins text-lg">Property Management</h3>
                <p className="text-sm text-white/90">
                  List and manage your properties with our streamlined certification tracking system.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/10 shadow-xl">
              <div className="mt-1 rounded-full bg-brand p-2.5 shadow-lg">
                <Building size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-medium font-poppins text-lg">Vendor Marketplace</h3>
                <p className="text-sm text-white/90">
                  Connect with service providers for cleaning, maintenance, and interior design.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/10 shadow-xl">
              <div className="mt-1 rounded-full bg-brand p-2.5 shadow-lg">
                <Leaf size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-medium font-poppins text-lg">Sustainability Tracking</h3>
                <p className="text-sm text-white/90">
                  Monitor and improve eco-performance metrics for your properties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
