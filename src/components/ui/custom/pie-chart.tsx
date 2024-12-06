import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { Portfolio } from "@/divextypes/types";

// Define TypeScript interfaces for type safety
// interface Stock {
//   ticker: string;
//   name: string;
//   fullName: string;
//   sector: string;
// }

// interface PortfolioEntry {
//   quantity: number;
//   stock: Stock;
// }

// interface Portfolio {
//   id: string;
//   portfolioEntries: PortfolioEntry[] | null;
// }

interface PortfolioChartProps {
  selectedPortfolio: Portfolio | null;
}

// Define Tailwind CSS blue color palette
const chartColors: string[] = [
  "#63B3ED", // bg-blue-400
  "#4299E1", // bg-blue-500
  "#3182CE", // bg-blue-600
  "#2B6CB0", // bg-blue-700
  "#2C5282", // bg-blue-800
  "#2A4365", // bg-blue-900
  "#7F9CF5", // bg-indigo-400
  "#667EEA", // bg-indigo-500
  "#5A67D8", // bg-indigo-600
  "#4C51BF", // bg-indigo-700
  "#434190", // bg-indigo-800
  "#3C366B", // bg-indigo-900
  "#F687B3", // bg-fuchsia-400
  "#ED64A6", // bg-fuchsia-500
  "#D53F8C", // bg-fuchsia-600
  "#B83280", // bg-fuchsia-700
  "#97266D", // bg-fuchsia-800
  "#702459", // bg-fuchsia-900

];

// Utility function to generate a consistent shade of blue from a string
const generateColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % chartColors.length;
  return chartColors[index];
};

// Not used, needs to stay tho or progam dies
const stockChartConfig = {
  stocks: [
    { name: "MAERSK-A", color: "#8884d8" },
  ],
};

const CustomLegend = (props: any) => {
  const { payload } = props;
console.log("PAYLOAD", payload)
  return (
    <ul className="flex flex-col">
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex items-center mr-2">
          <span
            className="inline w-3 h-3 mr-1"
            style={{ backgroundColor: entry.payload.fill }}
          ></span>
          <span className="text-sm text-gray-700">{entry.value}</span>
        </li>
        
      ))}
    </ul>
  );
};

export function PortfolioChart({ selectedPortfolio }: PortfolioChartProps) {
  console.log("Selected Portfolio:", selectedPortfolio);

  // Memoize stockData to optimize performance
  const stockData = React.useMemo(() => {
    if (!selectedPortfolio || !selectedPortfolio.portfolioEntries) {
      console.log("No portfolio entries");
      return [];
    }
    return selectedPortfolio.portfolioEntries.map((entry) => ({
      name: entry.stock.ticker.slice(0, -3),
      fullName: entry.stock.name,
      value: entry.quantity,
      sector: entry.stock.sector,
    }));
    
  }, [selectedPortfolio]);

  console.log("Stock Data:", stockData);
  // If selectedPortfolio is null, display a loading indicator
  if (!selectedPortfolio) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Holdings</CardTitle>
          <CardDescription>Overview of all current holdings.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div>Loading...</div>
        </CardContent>
      </Card>
    );
  }

  // If portfolioEntries is null or empty, display a message
  if (
    !selectedPortfolio.portfolioEntries ||
    selectedPortfolio.portfolioEntries.length === 0
  ) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Holdings</CardTitle>
          <CardDescription>No holdings available.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div>No portfolio entries to display.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-primary-foreground shadow-md">
      <CardHeader className="items-center pb-0">
        <CardTitle>Holdings</CardTitle>
        <CardDescription>Overview of all current holdings.</CardDescription>
      </CardHeader>
      <CardContent className="">
        <ChartContainer
          config={stockChartConfig} // same as below, don't remove this
          
        >
          <PieChart>
            
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={stockData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
            >
              {stockData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={generateColor(entry.name)} />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              content={<CustomLegend />}

            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
