import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useNavigate } from 'react-router-dom';
import { checkHttpsErrors } from '@/js/util'

const weeklyTopStocks = [
    { name: "Apple Inc.", ticker: "AAPL", visits: 10532 },
    { name: "Tesla Inc.", ticker: "TSLA", visits: 9482 },
    { name: "Microsoft Corp.", ticker: "MSFT", visits: 8341 },
    { name: "Amazon.com, Inc.", ticker: "AMZN", visits: 7523 },
    { name: "Alphabet Inc.", ticker: "GOOGL", visits: 6894 },
  ];
  
  const monthlyTopStocks = [
    { name: "Meta Platforms, Inc.", ticker: "META", visits: 12587 },
    { name: "NVIDIA Corporation", ticker: "NVDA", visits: 11265 },
    { name: "Netflix, Inc.", ticker: "NFLX", visits: 10645 },
    { name: "Adobe Inc.", ticker: "ADBE", visits: 9871 },
    { name: "Intel Corporation", ticker: "INTC", visits: 8502 },
  ];
  

export default function Trending() {

    const navigate = useNavigate();
    // const [weeklyTopStocks, setWeeklyTopStocks] = useState([]);
    // const [monthlyTopStocks, setMonthlyTopStocks] = useState([]);

    // useEffect(() => {
    //     function fetchAtSpecificTime() {
    //         const now = new Date();
    //         const fetchTime = new Date();
    //         fetchTime.setHours(24,0,0,0);

    //         // @ts-ignore
    //         const timeUntilFetch = fetchTime - now;

    //         setTimeout(() => {
    //             fetchWeeklyTopStock();
    //             fetchMonthlyTopStock();

    //             setInterval(() => {
    //                 fetchWeeklyTopStock();
    //                 fetchMonthlyTopStock();
    //             }, 24 * 60 * 60 * 1000); //24 hours in milliseconds
    //         }, timeUntilFetch);
    //     }

    //     fetchAtSpecificTime();
    // }, []);

    // async function fetchWeeklyTopStock() {
    //     const response = await fetch("http://localhost:8080/api/v1/stock/popularity/week");
    //     checkHttpsErrors(response);
    //     const weeklyTopStocksData = await response.json();
    //     setWeeklyTopStocks(weeklyTopStocksData);
    // }

    // async function fetchMonthlyTopStock() {
    //     const response = await fetch("http://localhost:8080/api/v1/stock/popularity/month");
    //     checkHttpsErrors(response);
    //     const monthlyTopStocksData = await response.json();
    //     setMonthlyTopStocks(monthlyTopStocksData);
    // }

    function showStockDetails(ticker: string) {
        navigate("/stocks/" + ticker);
    }

    return (
        <>
            <div className='grid grid-cols-4 gap-6'>
                <div className="col-span-4">
                        <h1 className='text-5xl text-start'>Trending Stocks</h1>
                </div>
                <div className='col-span-2 bg-primary-foreground rounded-md p-6'>
                    <h2 className='flex justify-start font-semibold text-xl'>Monthly top stocks</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='w-1'>#</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Ticker</TableHead>
                                <TableHead>Visits</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {monthlyTopStocks.map((stock, index) =>
                                <TableRow
                                    onClick={() => {
                                        showStockDetails(stock.ticker)
                                    }}>
                                    <TableCell className="text-start font-medium">{index + 1}</TableCell>
                                    <TableCell className="text-start font-medium">{stock.name}</TableCell>
                                    <TableCell className="text-start font-medium">{stock.ticker}</TableCell>
                                    <TableCell className="text-start font-medium">{stock.visits}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className='col-span-2 bg-primary-foreground rounded-md p-6'>
                    <h2 className='flex justify-start font-semibold text-xl'>Weekly top stocks</h2>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='w-1'>#</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Ticker</TableHead>
                                <TableHead>Visits</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>

                            {weeklyTopStocks.map((stock, index) =>
                                <TableRow
                                    onClick={() => {
                                        showStockDetails(stock.ticker)
                                    }}>
                                    <TableCell className="text-start font-medium">{index + 1}</TableCell>
                                    <TableCell className="text-start font-medium">{stock.name}</TableCell>
                                    <TableCell className="text-start font-medium">{stock.ticker}</TableCell>
                                    <TableCell className="text-start font-medium">{stock.visits}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    )
}