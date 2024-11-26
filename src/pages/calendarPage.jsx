"use client";

import * as React from "react";
import { useEffect } from "react";
import { Calendar } from "@/components/ui/Calendar";



// skal self. ændres når det skal bruges
const url = "https://www.placeholder.com";

// tænker vi updater tabellen når man vælger en ny dato
/*
useEffect(() => {
  if (date) {
    updateTable(date);
  }
}, [date]);
*/

const updateTable = () => {};

const handleFetch = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
};

// hardcoded datoer for testing
const dividendDays = [
    new Date(2024, 11, 28),
    new Date(2024, 11, 29),
    new Date(2024, 11, 30),
  ];

export default function CalendarPage() {
  const [date, setDate] = React.useState(new Date());

  return (
    <>
      <div className="flex justify-left p-6">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          dividendDays={dividendDays}
        />
      </div>
    </>
  );
}
