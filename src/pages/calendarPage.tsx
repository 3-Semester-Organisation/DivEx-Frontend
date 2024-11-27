"use client";

import * as React from "react";
import { useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// skal self. ændres når det skal bruges
const url = "https://www.placeholder.com";

const stocks = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: "$150.00",
    dividend: 0.5,
    amount: 10,
    date: new Date(2024, 11, 28),
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: "$2,500.00",
    dividend: 10.0,
    amount: 5,
    date: new Date(2024, 11, 29),
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: "$300.00",
    dividend: 1.0,
    amount: 20,
    date: new Date(2024, 11, 30),
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: "$3,500.00",
    dividend: 15.0,
    amount: 2,
    date: new Date(2024, 11, 28),
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: "$700.00",
    dividend: 5.0,
    amount: 5,
    date: new Date(2024, 11, 29),
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: "$200.00",
    dividend: 2.0,
    amount: 10,
    date: new Date(2024, 11, 30),
  },
  {
    symbol: "PYPL",
    name: "PayPal Holdings Inc.",
    price: "$100.00",
    dividend: 1.0,
    amount: 10,
    date: new Date(2024, 11, 28),
  },
  {
    symbol: "INTC",
    name: "Intel Corporation",
    price: "$50.00",
    dividend: 0.5,
    amount: 20,
    date: new Date(2024, 11, 29),
  },
  {
    symbol: "CSCO",
    name: "Cisco Systems Inc.",
    price: "$40.00",
    dividend: 0.25,
    amount: 20,
    date: new Date(2024, 11, 30),
  },
  {
    symbol: "NFLX",
    name: "Netflix Inc.",
    price: "$500.00",
    dividend: 2.5,
    amount: 5,
    date: new Date(2024, 11, 28),
  },
];

const handleFetch = async (url) => {
  const res = await fetch(url);
  const stocks = await res.json();
};

const dividendDates = () => {
  const dates = [];
  stocks.forEach((stock) => {
    dates.push(stock.date);
  });
  return dates;
};

export default function CalendarPage() {
  const [date, setDate] = React.useState(undefined);

  //filterer på current valgte date
  const filteredStocks = date
    ? stocks.filter(
        (stock) => stock.date.toDateString() === date.toDateString()
      )
    : stocks;

  const totalDividends = () => {
    let total = 0;
    filteredStocks.forEach((stock) => {
      total += stock.amount * stock.dividend;
    });
    return total;
  };

  //when resetbutton is clicked, set date to undefined
  useEffect(() => {
    const resetButton = document.getElementById("reset-button");
    if (resetButton) {
      resetButton.addEventListener("click", () => {
        setDate(undefined);
      });
    }
    return () => {
      if (resetButton) {
        resetButton.removeEventListener("click", () => {
          setDate(undefined);
        });
      }
    };
  }, []);

  return (
    <>
      <div className="grid grid-cols-4 p-6">
        <div className="col-span-1 mb-10">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border mb-4 bg-primary-foreground mr-28"
            dividendDays={dividendDates()}
          />
          <Button
            id="reset-button"
            className="bg-primary-foreground text-white flex justify-start mt-2 button-sm hover:bg-accent"
          >
            Reset
          </Button>
        </div>

        <div className="col-span-4 bg-primary-foreground rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Ticker</TableHead>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Price</TableHead>
                <TableHead className="text-center">Dividend</TableHead>
                <TableHead className="text-center">Amount</TableHead>
                <TableHead className="text-center">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStocks.map((stock) => (
                <TableRow key={stock.symbol}>
                  <TableCell className="font-medium">{stock.symbol}</TableCell>
                  <TableCell>{stock.name}</TableCell>
                  <TableCell>{stock.price}</TableCell>
                  <TableCell>${stock.dividend}</TableCell>
                  <TableCell>{stock.amount}</TableCell>
                  <TableCell>{stock.date.toDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="text-right" colSpan={5}>
                  Total Dividends:
                </TableCell>
                <TableCell className="text-center">
                  ${totalDividends()}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </>
  );
}
