"use client";

import * as React from "react";
import { useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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

const PAGESIZE = 10;
const URL = "http://localhost:8080/api/v1/stocks";

const dates = [];

interface Stock {
  ticker: string;
  name: string;
  dividendRate: number;
  // price: string;
  exDividendDate: number;
  currency: string;
}

interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
}

const convertUnixToDate = (unix: number) => {
  return new Date(unix * 1000);
};

const dividendDates = (stocks: Stock[]) => {
  stocks.forEach((stock) => {
    dates.push(convertUnixToDate(stock.exDividendDate));
  });
  return dates;
};

export default function CalendarPage() {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [stocks, setStocks] = React.useState<Stock[]>([]);
  const [totalPages, setTotalPages] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const handleFetch = async (url: string) => {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  };

  const fetchData = async () => {
    setLoading(true);
    const url = `http://localhost:8080/api/v1/stocks?page=${currentPage}&size=${PAGESIZE}&sort=ticker,asc`;
    try {
      const data: PaginatedResponse<Stock> = await handleFetch(url);
      console.log(handleFetch(url));
      console.log(data);
      const convertedStocks = data.content.map((stock) => ({
        ...stock,
        //remove last three letters from ticker, it's always ".CO"
        ticker: stock.ticker.slice(0, -3),
      }));
      setStocks(convertedStocks);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [currentPage]);


  // filtrer på current valgte date fra state
  // skriv om til at fetch data, og kun vis dem der matcher date
  const filteredStocks = date
    ? stocks.filter(
        (stock) =>
          convertUnixToDate(stock.exDividendDate).toDateString() ===
          date.toDateString()
      )
    : stocks;

  // PAGINATION
  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((next) => Math.min(next + 1, totalPages - 1));
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i);
  // PAGINATION END

  //when resetbutton is clicked, set date to undefined
  useEffect(() => {
    const resetButton = document.getElementById("reset-button");
    if (resetButton) {
      resetButton.addEventListener("click", () => {
        setDate(undefined);
      });
    }
  }, []);

  return (
    <>
      <div className="flex flex-row p-6">
        <div className="">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg bg-primary-foreground mr-28"
            dividendDays={dividendDates(stocks)}
          />
          <Button
            id="reset-button"
            className="bg-primary-foreground text-white flex mt-4 rounded-lg hover:bg-accent"
          >
            Reset
          </Button>
        </div>
      </div>
      <div className="p-6">
        <div className="max-w-6xl">
          {loading ? (
            <div className="text-center p-4">Loading...</div>
          ) : (
            <>
              <Table className="bg-primary-foreground rounded-lg">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Ticker</TableHead>
                    <TableHead className="text-center">Name</TableHead>
                    <TableHead className="text-center">Dividend</TableHead>
                    <TableHead className="text-center">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStocks.map((stock) => (
                    <TableRow key={stock.ticker}>
                      <TableCell className="font-medium">
                        {stock.ticker}
                      </TableCell>
                      <TableCell>{stock.name}</TableCell>
                      <TableCell>
                        {stock.dividendRate} {stock.currency}
                      </TableCell>
                      <TableCell>
                        {convertUnixToDate(stock.exDividendDate).toDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter></TableFooter>
              </Table>
              <div className="flex mx-auto w-40 mt-4 mb-4 justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePreviousPage();
                        }}
                      />
                    </PaginationItem>
                    {pageNumbers.map((pageNumber) => (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          className="cursor-pointer"
                          isActive={currentPage === pageNumber}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageClick(pageNumber);
                          }}
                        >
                          {pageNumber + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          handleNextPage();
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
              </>

          )}
          </div>
      </div>
    </>
  );
}
