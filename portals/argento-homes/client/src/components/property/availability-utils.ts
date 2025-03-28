import { Booking } from '@shared/schema';
import { isSameDay } from 'date-fns';

/**
 * Gets all booked dates for a property from a list of bookings
 * 
 * @param bookings Array of bookings (typically for a specific property)
 * @param includeStatus Optional array of booking statuses to consider (defaults to ['confirmed'] only)
 * @returns Array of dates that are booked
 */
export function getBlockedDates(
  bookings: Booking[], 
  includeStatus: string[] = ['confirmed']
): Date[] {
  const blockedDates: Date[] = [];
  
  // Filter by the specified statuses
  const filteredBookings = bookings.filter(booking => 
    includeStatus.includes(booking.status)
  );
  
  // For each booking, add all dates between check-in and check-out
  filteredBookings.forEach(booking => {
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    
    // Generate an array of dates between check-in and check-out (inclusive)
    let currentDate = new Date(checkIn);
    while (currentDate <= checkOut) {
      blockedDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });
  
  return blockedDates;
}

/**
 * Checks if a given date is blocked (already booked)
 * 
 * @param date The date to check
 * @param blockedDates Array of dates that are blocked/booked
 * @returns Boolean indicating if the date is blocked
 */
export function isDateBlocked(date: Date, blockedDates: Date[]): boolean {
  return blockedDates.some(blockedDate => isSameDay(date, blockedDate));
}

/**
 * Checks if a date range has any conflicts with existing bookings
 * 
 * @param startDate The start date of the range to check
 * @param endDate The end date of the range to check
 * @param blockedDates Array of dates that are blocked/booked
 * @returns Boolean indicating if there's a conflict
 */
export function hasDateRangeConflict(
  startDate: Date,
  endDate: Date,
  blockedDates: Date[]
): boolean {
  // Generate an array of dates from start to end
  const rangeDates: Date[] = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    rangeDates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Check if any date in the range is blocked
  return rangeDates.some(date => isDateBlocked(date, blockedDates));
}