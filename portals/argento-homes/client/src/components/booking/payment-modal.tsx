import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { PriceBreakdown, getBookingTotalPrice } from "./price-breakdown";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (paymentIntentId: string) => void;
  propertyId: number;
  checkIn: Date;
  checkOut: Date;
  nightlyRate: number;
  serviceFee?: number;
  cleaningFee?: number;
  taxRate?: number;
}

export function PaymentModal({
  isOpen,
  onClose,
  onPaymentSuccess,
  propertyId,
  checkIn,
  checkOut,
  nightlyRate,
  serviceFee = 35,
  cleaningFee = 50,
  taxRate = 8.5
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  const totalAmount = getBookingTotalPrice(
    checkIn,
    checkOut,
    nightlyRate,
    serviceFee,
    cleaningFee,
    taxRate
  );

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
      // Create payment intent on the server
      const { clientSecret } = await apiRequest("POST", "/api/create-payment-intent", {
        amount: totalAmount,
        propertyId,
        description: `Booking for property #${propertyId}`
      }).then(res => res.json());
      
      if (!clientSecret) {
        throw new Error("Failed to create payment intent");
      }

      // Confirm the payment with Stripe.js
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === "succeeded") {
        toast({
          title: "Payment Successful",
          description: "Your booking has been confirmed.",
        });
        onPaymentSuccess(paymentIntent.id);
      } else {
        throw new Error(`Payment status: ${paymentIntent.status}`);
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      setCardError(error.message || "An unknown error occurred");
      toast({
        title: "Payment Failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete Your Booking</DialogTitle>
          <DialogDescription>
            Please enter your card details to complete your reservation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h3 className="font-medium">Price Details</h3>
            <PriceBreakdown
              checkIn={checkIn}
              checkOut={checkOut}
              nightlyRate={nightlyRate}
              serviceFee={serviceFee}
              cleaningFee={cleaningFee}
              taxRate={taxRate}
            />
          </div>

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
            onClick={onClose}
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
              `Pay Now`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}