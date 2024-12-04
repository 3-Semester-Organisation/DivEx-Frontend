import * as React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { checkHttpsErrors } from '@/js/util'

export default function homepage() {

    const navigate = useNavigate();
    const [weeklyTopStocks, setWeeklyTopStocks] = useState([]);
    const [monthlyTopStocks, setMonthlyTopStocks] = useState([]);

    useEffect(() => {
        async function fetchWeeklyTopStock() {
            const response = await fetch("http://localhost:8080/api/v1/stock/popularity/week");
            checkHttpsErrors(response);
            const weeklyTopStocksData = await response.json();
            setWeeklyTopStocks(weeklyTopStocksData);
        }

        async function fetchMonthlyTopStock() {
            const response = await fetch("http://localhost:8080/api/v1/stock/popularity/month");
            checkHttpsErrors(response);
            const monthlyTopStocksData = await response.json();
            setMonthlyTopStocks(monthlyTopStocksData);
        }

        fetchWeeklyTopStock();
        fetchMonthlyTopStock();
    }, []);

    function showStockDetails(ticker: string) {
        navigate("/stocks/" + ticker);
    }

    return (
        <>
            <div className='flex flex-col items-start gap-6'>
                <h1 className='text-4xl font-semibold'>Homepage</h1>

                <div className='w-1/4 bg-primary-foreground shadow-md rounded-lg p-6'>
                    <h2 className='flex justify-start font-semibold text-xl mb-4'>Monthly top stocks</h2>
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
                                    onClick={() => { showStockDetails(stock.ticker) }}>
                                    <TableCell className="text-start font-medium">{index}</TableCell>
                                    <TableCell className="text-start font-medium">{stock.name}</TableCell>
                                    <TableCell className="text-start font-medium">{stock.ticker}</TableCell>
                                    <TableCell className="text-start font-medium">{stock.visits}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className='w-1/4 bg-primary-foreground shadow-md rounded-lg p-6'>
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
                                    onClick={() => { showStockDetails(stock.ticker) }}>
                                    <TableCell className="text-start font-medium">{index}</TableCell>
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