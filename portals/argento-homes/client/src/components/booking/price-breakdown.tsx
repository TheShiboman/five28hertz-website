import { formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { calculateNights } from "@/lib/utils";

interface PriceBreakdownProps {
  checkIn: Date;
  checkOut: Date;
  nightlyRate: number;
  serviceFee: number;
  cleaningFee: number;
  taxRate: number;
}

export function PriceBreakdown({
  checkIn,
  checkOut,
  nightlyRate,
  serviceFee,
  cleaningFee,
  taxRate
}: PriceBreakdownProps) {
  const nights = calculateNights(checkIn, checkOut);
  const subtotal = nights * nightlyRate;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + serviceFee + cleaningFee + taxAmount;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-muted-foreground">
          {formatCurrency(nightlyRate)} x {nights} nights
        </div>
        <div className="font-medium">{formatCurrency(subtotal)}</div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-muted-foreground">Cleaning fee</div>
        <div className="font-medium">{formatCurrency(cleaningFee)}</div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-muted-foreground">Service fee</div>
        <div className="font-medium">{formatCurrency(serviceFee)}</div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-muted-foreground">Tax ({taxRate}%)</div>
        <div className="font-medium">{formatCurrency(taxAmount)}</div>
      </div>
      
      <Separator className="my-2" />
      
      <div className="flex justify-between items-center text-lg font-semibold">
        <div>Total</div>
        <div>{formatCurrency(total)}</div>
      </div>
    </div>
  );
}

export function getBookingTotalPrice(
  checkIn: Date, 
  checkOut: Date, 
  nightlyRate: number, 
  serviceFee: number, 
  cleaningFee: number, 
  taxRate: number
): number {
  const nights = calculateNights(checkIn, checkOut);
  const subtotal = nights * nightlyRate;
  const taxAmount = subtotal * (taxRate / 100);
  return subtotal + serviceFee + cleaningFee + taxAmount;
}