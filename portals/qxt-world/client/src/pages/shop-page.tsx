import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { apiRequest } from "@/lib/queryClient";
import { ShoppingCart } from "lucide-react";

// Use import.meta.env instead of process.env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

export default function ShopPage() {
  const [processing, setProcessing] = useState(false);
  const { data: products } = useQuery({
    queryKey: ["/api/products"],
  });

  const handlePurchase = async (productId: number, price: number) => {
    try {
      setProcessing(true);
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      const response = await apiRequest("POST", "/api/create-payment-intent", {
        amount: price,
      });
      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            // In a real app, you would collect card details here
            token: "tok_visa"
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Equipment Shop</h1>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product: any) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square mb-4 bg-muted rounded-lg overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-muted-foreground mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <p className="text-2xl font-bold">${product.price}</p>
                <Button
                  onClick={() => handlePurchase(product.id, product.price)}
                  disabled={processing}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Buy Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}