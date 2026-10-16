import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertVenueSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";

interface VenueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function VenueDialog({ open, onOpenChange, onSuccess }: VenueDialogProps) {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(insertVenueSchema),
    defaultValues: {
      name: "",
      address: "",
      country: "",
      city: "",
      tableCounts: {
        snooker: "0",
        pool: "0"
      },
      contactDetails: {
        email: "",
        phone: "",
        website: ""
      }
    }
  });

  const onSubmit = async (data: any) => {
    try {
      const formattedData = {
        ...data,
        tableCounts: {
          snooker: String(data.tableCounts.snooker),
          pool: String(data.tableCounts.pool)
        }
      };

      await apiRequest("POST", "/api/venues", formattedData);
      toast({
        title: "Success",
        description: "Venue registered successfully.",
      });
      form.reset();
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to register venue:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to register venue. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-[#C4A44E] hover:bg-[#D4C28A] text-white shadow-lg transition-all duration-200">
          <Plus className="h-4 w-4 mr-2 text-white" />
          Register New Venue
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-[#041D21] border border-[#C4A44E] shadow-[0_0_15px_rgba(196,164,78,0.1)]">
        <DialogHeader>
          <DialogTitle className="text-[#C4A44E]">Register New Venue</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#C4A44E]">Venue Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="border-[#C4A44E] focus:border-[#D4C28A] focus:ring-[#C4A44E] focus:ring-opacity-50 bg-[#062128] transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#C4A44E]">Country</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="border-[#C4A44E] focus:border-[#D4C28A] focus:ring-[#C4A44E] focus:ring-opacity-50 bg-[#062128] transition-all duration-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#C4A44E]">City</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="border-[#C4A44E] focus:border-[#D4C28A] focus:ring-[#C4A44E] focus:ring-opacity-50 bg-[#062128] transition-all duration-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#C4A44E]">Address</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="border-[#C4A44E] focus:border-[#D4C28A] focus:ring-[#C4A44E] focus:ring-opacity-50 bg-[#062128] transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-[#C4A44E]">Table Count</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tableCounts.snooker"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#C4A44E]">Snooker Tables</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          min="0" 
                          onChange={e => field.onChange(e.target.value)}
                          className="border-[#C4A44E] focus:border-[#D4C28A] focus:ring-[#C4A44E] focus:ring-opacity-50 bg-[#062128] transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tableCounts.pool"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#C4A44E]">Pool Tables</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          min="0" 
                          onChange={e => field.onChange(e.target.value)}
                          className="border-[#C4A44E] focus:border-[#D4C28A] focus:ring-[#C4A44E] focus:ring-opacity-50 bg-[#062128] transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-[#C4A44E]">Contact Details</h4>
              <FormField
                control={form.control}
                name="contactDetails.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#C4A44E]">Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        {...field}
                        className="border-[#C4A44E] focus:border-[#D4C28A] focus:ring-[#C4A44E] focus:ring-opacity-50 bg-[#062128] transition-all duration-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactDetails.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#C4A44E]">Phone</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        className="border-[#C4A44E] focus:border-[#D4C28A] focus:ring-[#C4A44E] focus:ring-opacity-50 bg-[#062128] transition-all duration-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactDetails.website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#C4A44E]">Website</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="https://"
                        className="border-[#C4A44E] focus:border-[#D4C28A] focus:ring-[#C4A44E] focus:ring-opacity-50 bg-[#062128] transition-all duration-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[#C4A44E] hover:bg-[#D4C28A] text-white shadow-md transition-all duration-200"
            >
              Register Venue
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}