import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { CheckCircle, Clock } from "lucide-react";

// Types
interface AvailabilityFilterProps {
  selectedDates: Date[];
  onDatesChange: (dates: Date[]) => void;
  selectedTimes: string[];
  onTimesChange: (times: string[]) => void;
}

const timeOptions = [
  { id: "morning", label: "Morning (6 AM - 12 PM)" },
  { id: "afternoon", label: "Afternoon (12 PM - 5 PM)" },
  { id: "evening", label: "Evening (5 PM - 10 PM)" },
];

export function AvailabilityFilter({
  selectedDates,
  onDatesChange,
  selectedTimes,
  onTimesChange,
}: AvailabilityFilterProps) {
  // State
  const [calendarView, setCalendarView] = useState<"calendar" | "slots">("calendar");

  // Get availabilities for the currently logged in user (will be used for time slot display)
  const { data: timeSlots } = useQuery<{ startTime: Date; endTime: Date }[]>({
    queryKey: ["/api/availability/time-slots", selectedDates[0]?.toISOString()],
    enabled: selectedDates.length > 0 && calendarView === "slots",
  });

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const dateExists = selectedDates.some(
      (d) => format(d, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
    
    if (dateExists) {
      onDatesChange(
        selectedDates.filter(
          (d) => format(d, "yyyy-MM-dd") !== format(date, "yyyy-MM-dd")
        )
      );
    } else {
      onDatesChange([...selectedDates, date]);
    }
  };

  // Handle time of day selection
  const handleTimeChange = (timeId: string) => {
    if (selectedTimes.includes(timeId)) {
      onTimesChange(selectedTimes.filter((t) => t !== timeId));
    } else {
      onTimesChange([...selectedTimes, timeId]);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Availability
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2 text-sm">
          <Button 
            variant={calendarView === "calendar" ? "default" : "outline"} 
            size="sm"
            onClick={() => setCalendarView("calendar")}
          >
            Calendar
          </Button>
          <Button 
            variant={calendarView === "slots" ? "default" : "outline"} 
            size="sm"
            onClick={() => setCalendarView("slots")}
            disabled={selectedDates.length === 0}
          >
            Time Slots
          </Button>
        </div>

        {calendarView === "calendar" ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose dates when you'd like to exchange skills.
            </p>
            <Calendar
              mode="multiple"
              selected={selectedDates}
              onSelect={(dates) => {
                if (Array.isArray(dates)) {
                  onDatesChange(dates);
                } else if (dates) {
                  handleDateSelect(dates);
                }
              }}
              className="border rounded-md"
              disabled={(date) => date < new Date()}
            />

            <div className="space-y-3 pt-2">
              <p className="text-sm font-medium">Time of Day</p>
              <div className="space-y-2">
                {timeOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`time-${option.id}`}
                      checked={selectedTimes.includes(option.id)}
                      onCheckedChange={() => handleTimeChange(option.id)}
                    />
                    <Label htmlFor={`time-${option.id}`} className="text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Available time slots for {selectedDates.length === 1 
                ? format(selectedDates[0], "MMM d, yyyy") 
                : `${selectedDates.length} selected dates`}
            </p>
            
            {timeSlots && timeSlots.length > 0 ? (
              <div className="space-y-2">
                {timeSlots.map((slot, index) => (
                  <div 
                    key={index} 
                    className="border rounded-md p-2 flex justify-between items-center"
                  >
                    <span>
                      {format(new Date(slot.startTime), "h:mm a")} - {format(new Date(slot.endTime), "h:mm a")}
                    </span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No available time slots found for the selected date(s).
              </div>
            )}
            
            <Button className="w-full" size="sm" variant="outline" onClick={() => setCalendarView("calendar")}>
              Back to Calendar
            </Button>
          </div>
        )}
        
        {selectedDates.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {selectedDates.length} {selectedDates.length === 1 ? "date" : "dates"} selected
          </div>
        )}
      </CardContent>
    </Card>
  );
}