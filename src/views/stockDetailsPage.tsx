import DividendInfo from '@/components/divex/DividendInfo'
import StockGraph from '@/components/divex/StockGraph'
import { useLocation, useParams } from 'react-router-dom';
import * as React from 'react'

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

            <div className="grid grid-rows-1 grid-flow-row gap-4 bg-slate-900 shadow-md rounded-lg p-4 w-full">
                <h2 className="font-bold text-3xl">Historical Dividend Chart</h2>
                <p>Chart goes here </p>
            </div>
        </>
    )
}