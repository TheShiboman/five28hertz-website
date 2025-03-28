import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return format(date, "PPP"); // "Jan 1, 2021"
}

export function formatDateTime(date: Date): string {
  return format(date, "PPp"); // "Jan 1, 2021, 12:00 PM"
}

export function getInitials(name: string): string {
  if (!name) return '?';
  
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}
