"use client";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function Calendar({
  range,
  setRange,
}: {
  range: DateRange | undefined;
  setRange: (range: DateRange | undefined) => void;
}) {
  return (
    <DayPicker
      mode="range"
      selected={range}
      onSelect={setRange}
      numberOfMonths={2}
      className="p-3 rounded-lg bg-white shadow-lg"
      modifiersClassNames={{
        selected: "bg-[#00b894] text-white hover:bg-[#019a7a]",
        today: "border border-[#00b894]",
      }}
      classNames={{
        caption: "text-center text-[#00b894] font-semibold mb-2",
        head_row: "text-gray-600 font-medium text-sm",
        head_cell: "px-2 py-1",
        row: "mt-1",
        cell: "p-1 text-center",
        day: "h-9 w-9 flex items-center justify-center rounded-md hover:bg-[#e6f9f5] cursor-pointer",
        day_selected: "bg-[#00b894] text-white rounded-md hover:bg-[#019a7a]",
        day_disabled: "text-gray-300 cursor-not-allowed",
        day_outside: "text-gray-400",
      }}
    />
  );
}
