import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HelpCircle, MessageSquare, Search, Send, FileText, User, Mail, Paperclip } from "lucide-react";
import { z } from "zod";

const supportRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

export default function HelpWidget() {
  const form = useForm({
    resolver: zodResolver(supportRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: z.infer<typeof supportRequestSchema>) => {
    console.log("Support request submitted:", data);
    // Handle support request submission
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Tabs defaultValue="faqs" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
            <TabsTrigger value="chat">Live Chat</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="faqs">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="Search FAQs..." />
                <Button size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium">How do I join a tournament?</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Navigate to the Tournaments page and click on "Register" for any open tournament.
                      Make sure to check the eligibility requirements and registration deadline.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium">How does the ranking system work?</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Rankings are calculated based on tournament performance, match statistics,
                      and overall activity. Points are awarded for wins, breaks, and tournament placements.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium">How can I get sponsored?</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Visit your Profile page and check the Sponsorship Application section.
                      Ensure you meet the minimum requirements and complete your player profile.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium">How do I report technical issues?</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Use the Support tab in this help widget to submit a detailed report.
                      Include screenshots and steps to reproduce the issue if possible.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chat">
            <div className="space-y-4">
              <div className="h-[300px] overflow-y-auto bg-accent p-4 rounded-lg">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="bg-primary/10 rounded-lg p-2 max-w-[80%]">
                      <p className="text-sm">Hello! How can I help you today?</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Type your message..." />
                <Button size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="support">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <User className="h-4 w-4 mt-3 text-muted-foreground" />
                          <Input {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Mail className="h-4 w-4 mt-3 text-muted-foreground" />
                          <Input {...field} type="email" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="min-h-[100px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button variant="outline" type="button" className="flex gap-2">
                    <Paperclip className="h-4 w-4" />
                    Attach Files
                  </Button>
                  <Button type="submit" className="flex-1">Submit Request</Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}