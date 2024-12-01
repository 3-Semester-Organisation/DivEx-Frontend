import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import TimeFrameSelector from "./TimeFrameSelector";


interface PriceMovement {
    previousDailyClosingPrice: number
    closingDate: number

}


const dailyClosingData = Array.from({ length: 20 }, (_, index) => ({
    previousDailyClosingPrice: (100 + Math.random() * 500).toFixed(2), // Random price between 100 and 150
    closingDate: Date.now() - (index * 24 * 60 * 60 * 1000) // Decrementing one day for each object
}));

export default function StockGraph({ stock }) {

    const [closingPrices, setClosingPrices] = useState(stock.historicalPricingResponseList);
    // const [closingPrices, setClosingPrices] = useState(dailyClosingData);
    const [closingPriceByTimeFrame, setClosingPriceByTimeFrame] = useState([]);
    const [timeFrame, setTimeFrame] = useState("YTD");

    function formatClosingDate(historicalClosingPrices) {
        const formatedClosingPriceData = historicalClosingPrices.map(data => ({
            ...data,
            formattedDate: new Date(data.closingDate).toDateString()
        }))
        setClosingPriceByTimeFrame(formatedClosingPriceData);
    }

    // initial load will load the YTD chart
    useEffect(() => {
        const currentDate = new Date();
        console.log("api data", stock.historicalPricingResponseList)
        console.log("test data", dailyClosingData)
        const yearToDatePriceMovement = closingPrices.filter(dataPoint => {
            console.log("closing date:", dataPoint.closingDate)
            const startOfYear = new Date(currentDate.getFullYear(), 1, 1).getTime(); // Start of the current year in milliseconds
            console.log("statt of year", startOfYear)
            return dataPoint.closingDate >= startOfYear/1000 && dataPoint.closingDate <= Date.now();
        });
        console.log("filtered result", yearToDatePriceMovement)
        setTimeFrame("YTD")
        formatClosingDate(yearToDatePriceMovement);
    }, []);


    return (
        <div className="w-2/3 bg-slate-900 shadow-md rounded-lg p-6">
            <div className="flex justify-start items-center">
                <h2 className="text-2xl font-bold mb-4">Price movment</h2>
                <h2 className="text-lg font-semibold ml-3 mb-3">({timeFrame})</h2>
            </div>

            <div className="flex flex-col items-center justify-center">
                <LineChart
                    className="mt-4"
                    width={1200}
                    height={200}
                    data={closingPriceByTimeFrame}
                >
                    <XAxis dataKey="formattedDate" padding={{ right: 100 }} />
                    <YAxis />
                    <Tooltip content={<StockChartToolTip currency={stock.currency} />} />
                    <Line type="monotone" dataKey="previousDailyClosingPrice" />
                </LineChart>

                <TimeFrameSelector
                    closingPrices={closingPrices}
                    timeFrame={timeFrame}
                    setTimeFrame={setTimeFrame}
                    formatClosingDate={formatClosingDate}
                />
            </div>
        </div>
    )
}

function StockChartToolTip({ active, payload, label, currency }) {
    if (active && payload && payload.length) {
        return (
            <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md border-2 border-gray-600">
                <p className="text-medium text-lg">{label}</p>
                <p className="text-small text-gray-500">
                    Closing price:
                    <span className="ml-2">{payload[0].value} {currency}</span>
                </p>
            </div>
        );
    }

    return null;
}