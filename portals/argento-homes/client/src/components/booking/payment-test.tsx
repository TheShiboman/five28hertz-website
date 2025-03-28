import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function PaymentTest() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [amount, setAmount] = useState("99.99");
  const [selectedCase, setSelectedCase] = useState("success");
  
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  
  // Create a payment intent and process payment
  const handlePayment = async () => {
    if (!stripe || !elements) {
      toast({
        title: "Payment Error",
        description: "Stripe has not been properly initialized.",
        variant: "destructive",
      });
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast({
        title: "Payment Error",
        description: "Card element not found.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setCardError(null);

    try {
      // First, create a payment intent using the public API endpoint
      const amountValue = parseFloat(amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error("Please enter a valid amount");
      }
      
      const paymentIntentResponse = await apiRequest("POST", "/api/public/create-payment-intent", {
        amount: amountValue,
        description: `Test payment (${selectedCase} case)`,
      });

      if (!paymentIntentResponse.ok) {
        const errorData = await paymentIntentResponse.json();
        throw new Error(errorData.message || "Failed to create payment intent");
      }

      const { clientSecret, paymentIntentId } = await paymentIntentResponse.json();

      // Confirm the card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        throw new Error(error.message || "Payment failed");
      }

      if (paymentIntent.status === "succeeded") {
        setPaymentSuccess(true);
        setPaymentId(paymentIntentId);
        setIsPaymentModalOpen(false);
        toast({
          title: "Payment Successful",
          description: `Payment of $${amountValue.toFixed(2)} completed successfully.`,
        });
      } else {
        throw new Error(`Payment status: ${paymentIntent.status}`);
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      setCardError(error.message || "An error occurred during payment processing");
      toast({
        title: "Payment Failed",
        description: error.message || "An error occurred during payment processing",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle test cases
  const handleCaseChange = (value: string) => {
    setSelectedCase(value);
    switch (value) {
      case "success":
        setAmount("99.99");
        break;
      case "require-auth":
        setAmount("159.99");
        break;
      case "declined":
        setAmount("199.99");
        break;
      default:
        setAmount("99.99");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h3 className="text-xl font-medium text-gray-900">Stripe Payment Test</h3>
      <p className="mt-2 text-sm text-gray-500">
        Test the Stripe payment integration with different test scenarios
      </p>
      
      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="test-case">Test Scenario</Label>
          <Select 
            value={selectedCase} 
            onValueChange={handleCaseChange}
          >
            <SelectTrigger id="test-case" className="w-full">
              <SelectValue placeholder="Select a test case" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="success">Successful Payment</SelectItem>
              <SelectItem value="require-auth">Requires Authentication</SelectItem>
              <SelectItem value="declined">Payment Declined</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (USD)</Label>
          <Input 
            id="amount" 
            type="number" 
            step="0.01" 
            min="0.50"
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        
        <Button 
          className="w-full" 
          onClick={() => setIsPaymentModalOpen(true)}
        >
          Test Payment
        </Button>
      </div>
      
      {paymentSuccess && (
        <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-md">
          <p className="font-semibold">Payment Successful!</p>
          <p className="text-sm mt-1">Amount: ${parseFloat(amount).toFixed(2)}</p>
          <p className="text-xs mt-1">Payment ID: {paymentId}</p>
        </div>
      )}

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-900">Test Cards:</h4>
        <ul className="mt-2 text-xs space-y-1 text-gray-500">
          <li>Success: 4242 4242 4242 4242</li>
          <li>Requires Auth: 4000 0025 0000 3155</li>
          <li>Declined: 4000 0000 0000 0002</li>
          <li><span className="text-gray-400">For all cards, use any future date, any 3 digits for CVC, and any postal code</span></li>
        </ul>
      </div>

      {/* Payment Dialog */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Test Payment</DialogTitle>
            <DialogDescription>
              Enter test card details to process a payment of ${parseFloat(amount).toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <h3 className="font-medium">Payment Information</h3>
              <div className="border rounded-md p-3">
                <CardElement 
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }}
                />
              </div>
              {cardError && (
                <p className="text-sm text-red-500">{cardError}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsPaymentModalOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePayment} 
              disabled={isProcessing || !stripe || !elements}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay $${parseFloat(amount).toFixed(2)}`
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}