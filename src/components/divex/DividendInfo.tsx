import * as React from 'react'

export default function DividendInfo({ stock }) {

    const latestClosingPrice = stock.historicalPricingResponseList[stock.historicalPricingResponseList.length - 1].previousDailyClosingPrice;

    return (
        <div className="w-1/3 bg-slate-900 shadow-md rounded-lg p-6">

            <h2 className="flex justify-start text-2xl font-bold mb-4 ml-1">Dividend Info</h2>

            <div className="grid xl:grid-cols-3 gap-4 md:grid-cols-2">
                <div className="bg-slate-950 rounded-md flex flex-col items-center justify-center h-20 ">
                    <h1 className='text-md'>Dividend Yield</h1>
                    <p className='text-lg font-bold'>{(stock.dividendYield * 100).toFixed(2)}%</p>
                </div>
                <div className="bg-slate-950 rounded-md flex flex-col items-center justify-center h-20">
                    <h1 className='text-md'>Dividend Rate</h1>
                    <p className='text-lg font-bold'>{stock.dividendRate} {stock.currency}</p>
                </div>
                <div className="bg-slate-950 rounded-md flex flex-col items-center justify-center h-20">
                    <h1 className='text-md'>Dividend Ratio</h1>
                    <p className='text-lg font-bold'>{(stock.dividendRatio * 100).toFixed(2)}%</p>
                </div>
                <div className="bg-slate-950 rounded-md flex flex-col items-center justify-center h-20">
                    <h1 className='text-md'>5-Year Avg. Dividend Yield</h1>
                    <p className='text-lg font-bold'>{stock.fiveYearAvgDividendYield}%</p>
                </div>
                <div className="bg-slate-950 rounded-md flex flex-col items-center justify-center h-20">
                    <h1 className='text-md'>Dividend Ex Date</h1>
                    <p className='text-lg font-bold'>{new Date(stock.exDividendDate * 1000).toDateString()}</p>
                </div>
                <div className="bg-slate-950 rounded-md flex flex-col items-center justify-center h-20">
                    <h1 className='text-md'>Closing price</h1>
                    <p className='text-lg font-bold'>{latestClosingPrice} {stock.currency}</p>
                </div>
            </div>
        </div>
    )
}