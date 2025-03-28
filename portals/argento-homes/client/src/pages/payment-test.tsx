import { PaymentTest } from "@/components/booking/payment-test";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PaymentTestPage() {
  const [, navigate] = useLocation();
  const isPublic = window.location.pathname.includes("payment-public");
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-2" 
            onClick={() => navigate(isPublic ? "/guest-portal" : "/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Stripe Payment Test</h1>
        </div>
        
        {isPublic && (
          <div className="mb-6 bg-blue-50 text-blue-700 p-4 rounded-md max-w-md mx-auto">
            <p className="text-sm">
              This is a public test page for the Stripe payment system. No authentication required.
            </p>
          </div>
        )}
        
        <div className="max-w-md mx-auto">
          <PaymentTest />
        </div>
      </div>
    </div>
  );
}