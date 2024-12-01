import DividendInfo from '@/components/divex/DividendInfo'
import StockGraph from '@/components/divex/StockGraph'
import { useLocation, useParams } from 'react-router-dom';
import * as React from 'react'
import HistoricalDividendChart from '@/components/divex/HistoricalDividendChart';

export default function StockDetailsPage() {

    const location = useLocation();
    const stock = location.state?.stock;

    return (
        <>
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
                <HistoricalDividendChart stock={stock}/>
            </div>
        </>
    )
}