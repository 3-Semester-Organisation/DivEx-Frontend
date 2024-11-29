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
        </>
    )
}