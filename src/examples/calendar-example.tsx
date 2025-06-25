import React from "react";
import { Calendar } from "@/components/ui/calendar";

export function CalendarExample() {
  // Example usage with selectedDates prop
  const selectedDates = [
    new Date(2025, 5, 10), // June 10, 2025
    new Date(2025, 5, 15), // June 15, 2025
    new Date(2025, 5, 20), // June 20, 2025
    new Date(2025, 5, 25), // June 25, 2025 (today)
  ];

  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Calendar with Selected Dates</h2>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        selectedDates={selectedDates}
        className="rounded-md border"
      />
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">
          Highlighted dates appear with a light primary background.
          Selected dates (June 10, 15, 20, 25) are highlighted in addition to your current selection.
        </p>
      </div>
    </div>
  );
}
