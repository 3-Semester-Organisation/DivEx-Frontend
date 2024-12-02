import DividendInfo from '@/components/divex/DividendInfo'
import StockGraph from '@/components/divex/StockGraph'
import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { checkHttpsErrors } from '@/js/util'
import * as React from 'react'
import HistoricalDividendChart from '@/components/divex/HistoricalDividendChart';

export default function StockDetailsPage() {

    // const location = useLocation();
    // const stock = location.state?.stock;

    const { ticker } = useParams();

    const [stock, setStock] = useState(null);

    useEffect(() => {
        async function fetchStockByTicker(ticker: string) {
            try {
                const response = await fetch("http://localhost:8080/api/v1/stock/" + ticker)
                checkHttpsErrors(response);
                const stockResponse = await response.json();

                setStock(stockResponse);

            } catch (error) {
                console.error(error);
            }
        }

        fetchStockByTicker(ticker);
    }, [stock]);

    return (
        <>
            {stock === null ? (<p>Loading...</p>) : (
                <div>
                    <div className='flex justify-start'>
                        <h1 className='ml-6 font-bold text-3xl'>{stock.name}</h1>
                        <p className='mt-3 ml-3'>{`(${stock.ticker.toUpperCase()})`}</p>
                    </div>

                    <div className="flex gap-6 p-4">

                        <DividendInfo stock={stock} />

                        <StockGraph stock={stock} />

                    </div>

                    <div className="flex flex-col justify-center items-center bg-slate-900 shadow-md rounded-lg p-4 mt-1 ml-4 mr-4">
                        <h2 className="font-bold text-2xl">Historical Dividend Chart</h2>
                        <HistoricalDividendChart stock={stock} />
                    </div>
                </div>
            )}
        </>
    )
}