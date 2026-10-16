import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy } from "lucide-react";
import { useEffect } from "react";
import { FirebaseAuthButton } from "@/components/auth/firebase-auth-button";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const loginForm = useForm({
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const registerForm = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
      passwordConfirm: "",
      fullName: "",
      email: "",
      role: "player"
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#041d21] to-[#062128] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8">
        <div className="flex flex-col justify-center">
          <div className="space-y-6">
            <div className="flex flex-col items-center mb-8">
              <img 
                src="/qxt-logo.png" 
                alt="QXT World Logo" 
                className="w-40 h-40 mb-6"
              />
              <div className="flex items-center gap-2">
                <h1 className="text-5xl font-bold text-[#c4a45b]">QXT World</h1>
              </div>
            </div>
            <p className="text-xl text-muted-foreground">
              Welcome to the future of cue sports. Join our digital ecosystem for tournaments,
              live scoring, and professional equipment.
            </p>
          </div>
        </div>

        <Card className="w-full border-[#c4a45b] shadow-gold">
          <CardHeader className="text-center">
            <Trophy className="h-12 w-12 text-[#c4a45b] mx-auto mb-4" />
            <CardTitle className="text-3xl font-bold text-[#c4a45b]">Welcome to QXT World</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <FirebaseAuthButton />
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-[#c4a45b]/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="text-[#c4a45b] data-[state=active]:bg-[#062128] data-[state=active]:text-[#e6c680]">Login</TabsTrigger>
                <TabsTrigger value="register" className="text-[#c4a45b] data-[state=active]:bg-[#062128] data-[state=active]:text-[#e6c680]">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit((data) => loginMutation.mutate(data))} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#c4a45b]">Username</FormLabel>
                          <FormControl>
                            <Input {...field} className="border-[#c4a45b] focus:ring-[#c4a45b] focus:border-[#e6c680] transition-colors" />
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
                          <FormLabel className="text-[#c4a45b]">Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} className="border-[#c4a45b] focus:ring-[#c4a45b] focus:border-[#e6c680] transition-colors" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-[#c4a45b] hover:bg-[#e6c680] text-white shadow-md transition-colors"
                      disabled={loginMutation.isPending}
                    >
                      Login
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit((data) => registerMutation.mutate(data))} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#c4a45b]">Username</FormLabel>
                          <FormControl>
                            <Input {...field} className="border-[#c4a45b] focus:ring-[#c4a45b] focus:border-[#e6c680] transition-colors" />
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
                          <FormLabel className="text-[#c4a45b]">Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} className="border-[#c4a45b] focus:ring-[#c4a45b] focus:border-[#e6c680] transition-colors" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="passwordConfirm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#c4a45b]">Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} className="border-[#c4a45b] focus:ring-[#c4a45b] focus:border-[#e6c680] transition-colors" />
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
                          <FormLabel className="text-[#c4a45b]">Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="border-[#c4a45b] focus:ring-[#c4a45b] focus:border-[#e6c680] transition-colors" />
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
                          <FormLabel className="text-[#c4a45b]">Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} className="border-[#c4a45b] focus:ring-[#c4a45b] focus:border-[#e6c680] transition-colors" />
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
                          <FormLabel className="text-[#c4a45b]">Role</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="w-full px-3 py-2 border rounded-md border-[#c4a45b] bg-background focus:ring-[#c4a45b] focus:border-[#e6c680] transition-colors"
                            >
                              <option value="player">Player</option>
                              <option value="coach">Coach</option>
                              <option value="referee">Referee</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-[#c4a45b] hover:bg-[#e6c680] text-white shadow-md transition-colors"
                      disabled={registerMutation.isPending}
                    >
                      Register
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}