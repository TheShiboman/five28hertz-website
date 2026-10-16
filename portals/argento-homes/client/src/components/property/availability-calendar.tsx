import { useEffect, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Booking } from '@shared/schema';
import { format } from 'date-fns';
import { getBlockedDates, isDateBlocked } from './availability-utils';

interface AvailabilityCalendarProps {
  bookings: Booking[];
  className?: string;
}

export function AvailabilityCalendar({ bookings, className }: AvailabilityCalendarProps) {
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  // Calculate blocked dates when bookings change
  useEffect(() => {
    setBlockedDates(getBlockedDates(bookings));
  }, [bookings]);

  // Disable dates that are already booked
  const isDateDisabled = (date: Date): boolean => {
    return isDateBlocked(date, blockedDates);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Property Availability</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-sm text-gray-500">
          <span className="inline-block h-3 w-3 rounded-full bg-red-100 mr-2"></span>
          Booked / Unavailable
        </div>
        <Calendar
          mode="default"
          month={selectedMonth}
          onMonthChange={setSelectedMonth}
          disabled={(date) => isDateBlocked(date, blockedDates)}
          modifiers={{
            booked: blockedDates
          }}
          modifiersClassNames={{
            booked: "bg-red-100 text-red-800 opacity-100"
          }}
          showOutsideDays
          classNames={{
            day_disabled: "bg-red-100 text-red-800 opacity-100",
          }}
        />
      </CardContent>
    </Card>
  );
}