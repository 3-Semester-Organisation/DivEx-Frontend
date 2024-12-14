import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import TimeFrameSelector from "./TimeFrameSelector";


interface PriceMovement {
    previousDailyClosingPrice: number
    closingDate: number
    openingPrice: number
    openingDate: number
}


const dailyClosingData = Array.from({ length: 20 }, (_, index) => ({
    previousDailyClosingPrice: (100 + Math.random() * 500).toFixed(2), // Random price between 100 and 150
    closingDate: new Date().setDate(new Date().getDate() + index)
}));

export default function StockGraph({ stock }) {

    const [closingPrices, setClosingPrices] = useState<PriceMovement[]>(stock.historicalPricing);
    const [closingPriceByTimeFrame, setClosingPriceByTimeFrame] = useState([]);
    const [timeFrame, setTimeFrame] = useState("YTD");

    function formatClosingDate(historicalClosingPrices: PriceMovement[]) {
        const formatedClosingPriceData = historicalClosingPrices.map(data => ({
            ...data,
            formattedDate: new Date(data.closingDate * 1000).toDateString()
        }))
        setClosingPriceByTimeFrame(formatedClosingPriceData);
    }

    // initial load will load the YTD chart
    useEffect(() => {
        const currentDate = new Date();
    
        const yearToDatePriceMovement = closingPrices.filter(dataPoint => {
            const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
            const closingDate = new Date(dataPoint.closingDate * 1000);

            return closingDate >= startOfYear && closingDate <= currentDate;
        });

        setTimeFrame("YTD")
        formatClosingDate(yearToDatePriceMovement);
    }, []);


    return (
        <div className="w-2/3 bg-primary-foreground shadow-md rounded-lg p-6">
            <div className="flex justify-start items-center">
                <h2 className="text-2xl font-bold mb-4">Price movment</h2>
                <h2 className="text-lg font-semibold ml-3 mb-3">({timeFrame})</h2>
            </div>

            <div className="flex flex-col items-center justify-center w-full h-[400px]" >
                <ResponsiveContainer>
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
                </ResponsiveContainer>

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
            <div className="p-4 bg-primary-foreground flex flex-col gap-4 rounded-md border-2 border-gray-600">
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