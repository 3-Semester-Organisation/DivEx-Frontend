import * as React from "react"
import { useState, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { Separator } from "@/components/ui/separator"
import "@/index.css"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface Stock { 
  ticker: string;
  name: string;
  dividendRate: number;
  currency: string;
}

export type CalendarProps = Omit<
  React.ComponentProps<typeof DayPicker>,
  "dividendDays" | "dividendData" | "onMonthChange"
> & {
  dividendDays: number[]
  dividendData: any
  onMonthChange: (month: Date) => void
}

const convertUnixToDate = (unix: number) => {
    return new Date(unix * 1000);
  };

const convertDividendDates = (dates: number[]) => {
    
    return dates.map((date) => convertUnixToDate(date));
}
  
function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function DividendCalendar({
  className,
  classNames,
  dividendDays,
  dividendData,
  onMonthChange,
  ...props
}: CalendarProps) {
  const dividendDates = convertDividendDates(dividendDays);
  

  return (
    <TooltipProvider>
    <DayPicker
      modifiers={{ dividend: dividendDates }}
      modifiersClassNames={{dividend: "dividend-day"}}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-muted-foreground text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
        components={{
        DayContent: CustomDayContent,
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
      />
      </TooltipProvider>
  )
}

// CustomDayContent Component
function CustomDayContent({ date, modifiers, className, dividendData, ...rest }) {
  const dateKey = formatDateKey(date);

  const [tooltipData, setTooltipData] = useState(null);
  const [open, setOpen] = useState(false);

  // Cache to store fetched data
  const dataCache = useRef<{ [key: string]: any }>({});

  // Fetch data for the date when tooltip opens
  const fetchDataForDate = useCallback(async () => {
    if (dataCache.current[dateKey]) {
      console.log("Data already fetched for date:", dateKey);
      setTooltipData(dataCache.current[dateKey]);
    } else {
      try {
        const unixTimestamp = Math.floor(new Date(dateKey).getTime() / 1000);
        const url = `http://localhost:8080/api/v1/stocksByDate?date=${unixTimestamp}&page=0&size=10`;
        const res = await fetch(url);
        const data = await res.json();
        dataCache.current[dateKey] = data;
        setTooltipData(data);
      } catch (error) {
        console.error("Error fetching data for date:", error);
        setTooltipData(null);
      }
    }
  }, [dateKey]);

  

  // Handle tooltip open state change
  const handleOpenChange = (nextOpen) => {
    setOpen(nextOpen);
    if (nextOpen) {
      fetchDataForDate();
    }
  };

  return (
    <Tooltip open={open} onOpenChange={handleOpenChange}>
      <TooltipTrigger asChild>
        <div {...rest} className={cn(className, "relative")}>
          {date.getDate()}
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" align="center">
      
        {tooltipData && tooltipData.content && tooltipData.content.length > 0 ? (
          tooltipData.content.map((stock: Stock) => (
            <div key={stock.ticker}>
              <p><strong>Ticker:</strong> {stock.ticker.slice(0, -3)}</p>
              <p><strong>Name:</strong> {stock.name}</p>
              <p><strong>Payout:</strong> {stock.dividendRate} {stock.currency}</p>
            </div>
          ))
        ) : (
          <div>No data available</div>
        )}
      </TooltipContent>
    </Tooltip>
  );
}


DividendCalendar.displayName = "Calendar"

export { DividendCalendar }
