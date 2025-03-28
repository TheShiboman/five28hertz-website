// TypeScript test file for calendar availability system
import { storage } from './server/storage';

async function testAvailability() {
  try {
    const userId = 1; // User ID for Emma

    // Test 1: Get user availability preferences
    console.log("\n--- Test: Get User Availability Preferences ---");
    const preferences = await storage.getUserAvailabilityPreferences(userId);
    console.log("User preferences:", preferences);

    // Test 2: Get weekly availability
    console.log("\n--- Test: Get Weekly Availability ---");
    const weeklyAvail = await storage.getWeeklyAvailability(userId);
    console.log("Weekly availability:", weeklyAvail);

    // Test 3: Get specific date availability
    console.log("\n--- Test: Get Specific Date Availability ---");
    const nextSaturday = new Date();
    const daysUntilNextSaturday = (6 - nextSaturday.getDay() + 7) % 7;
    nextSaturday.setDate(nextSaturday.getDate() + daysUntilNextSaturday);
    const specificDates = await storage.getSpecificDateAvailability(userId);
    console.log("Specific date availability:", specificDates);

    // Test 4: Get blocked time periods
    console.log("\n--- Test: Get Blocked Time Periods ---");
    const blockedTimes = await storage.getBlockedTimePeriods(userId);
    console.log("Blocked time periods:", blockedTimes);

    // Test 5: Get available time slots for a date
    console.log("\n--- Test: Get Available Time Slots ---");
    // Test with today's date
    const today = new Date();
    const timeSlots = await storage.getUserAvailableTimeSlots(userId, today);
    console.log("Available time slots for today:", timeSlots);

    // Test 6: Check availability for a specific time period
    console.log("\n--- Test: Check Availability ---");
    // Create a test time (2 hours from now)
    const now = new Date();
    const startTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour duration
    
    console.log(`Checking availability from ${startTime.toLocaleTimeString()} to ${endTime.toLocaleTimeString()}`);
    const isAvailable = await storage.checkUserAvailability(userId, startTime, endTime);
    console.log("Is available:", isAvailable);

  } catch (error) {
    console.error("Error testing availability:", error);
  }
}

testAvailability();