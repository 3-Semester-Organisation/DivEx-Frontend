import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import PaginationBar from "./PaginationBar";

export default function StockGraph({ stock }) {

    const [closingPrices, setClosingPrices] = useState([]);

    useEffect(() => {
    
        function formatClosingDate(historicalClosingPrices) {
            const formatedClosingPriceData = historicalClosingPrices.map(data => ({
                ...data,
                formattedDate: new Date(data.closingDate * 1000).toDateString()
            }))
            setClosingPrices(formatedClosingPriceData);
        }

        formatClosingDate(stock.historicalPricingResponseList)
    }, [])
    

    return (
        <div className="w-2/3 bg-slate-900 shadow-md rounded-lg p-6">
            <h2 className="flex justify-start text-2xl font-bold mb-4">Price movment</h2>

            <div className="flex flex-col items-center justify-center">
                <LineChart
                    className="mt-4"
                    width={1200}
                    height={200}
                    data={closingPrices}
                >
                    <XAxis dataKey="formattedDate" padding={{ right: 100 }} />
                    <YAxis />
                    <Tooltip content={<StockChartToolTip currency={stock.currency} />} />
                    <Line type="monotone" dataKey="previousDailyClosingPrice" />
                </LineChart>

                <PaginationBar></PaginationBar>
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