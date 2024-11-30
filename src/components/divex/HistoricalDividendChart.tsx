import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const dividendDataTest = [
    {
        dividendRate: 3.5,
        exDividendDate: 1695868800 // Example Unix timestamp
    },
    {
        dividendRate: 4.2,
        exDividendDate: 1698470400
    },
    {
        dividendRate: 2.8,
        exDividendDate: 1701052800
    }
];

export default function HistoricalDividendChart({ stock }) {
    const [dividendData, setDividendData] = useState([]);


    function formatDate(historicalDividends) {
        const formattedDividendData = historicalDividends.map(divData => ({
            ...divData,
            formattedDate: new Date(divData.exDividendDate * 1000).toDateString() // Convert to readable date
        }));
        setDividendData(formattedDividendData);
    }

    useEffect(() => {
        formatDate(stock.historicalDividendsResponseList);
    }, []);

    return (
        <LineChart
            className="mt-4"
            width={1800}
            height={400}
            data={dividendData}
        >
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="formattedDate" padding={{ right: 500 }} />
            <YAxis />
            <Tooltip content={<CustomToolTip currency={stock.currency} />} />
            <Line type="monotone" dataKey="dividendRate" stroke="#8884d8" />
        </LineChart>
    );
}

function CustomToolTip({ active, payload, label, currency }) {
    if (active && payload && payload.length) {
        return (
            <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md border-2 border-gray-600">
                <p className="text-medium text-lg">{label}</p>
                <p className="text-small text-gray-500">
                    Dividend rate:
                    <span className="ml-2">{payload[0].value} {currency}</span>
                </p>
            </div>
        );
    }

    return null;
}
