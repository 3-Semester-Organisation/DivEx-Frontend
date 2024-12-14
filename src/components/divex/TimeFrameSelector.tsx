import React, { Dispatch, SetStateAction } from "react";

interface PriceMovement {
    previousDailyClosingPrice: number
    closingDate: number

}

interface TimeFrameSelectorProps {
    closingPrices: PriceMovement[];
    timeFrame: string;
    setTimeFrame: Dispatch<SetStateAction<string>>;
    formatClosingDate: (historicalClosingPrices: PriceMovement[]) => void;
  }

export default function TimeFrameSelector({closingPrices, timeFrame, setTimeFrame, formatClosingDate}: TimeFrameSelectorProps) {
    
    function filterPriceMovementByTimeFrame(curentDate: Date, closingPrices, yearsPrior: number) {
        const cutOffDate = new Date();
        cutOffDate.setFullYear(curentDate.getFullYear() - yearsPrior);

        const filteredData = closingPrices.filter(dataPoint => {
            const closingDate = new Date(dataPoint.closingDate * 1000);
            return (closingDate >= cutOffDate) && (closingDate <= curentDate);
        })

        return filteredData;
    }


    function displayChartByTimeframe(timeFrame: string) {

        const currentDate = new Date(Date.now());

        switch (timeFrame) {
            case "YTD":
                const yearToDatePriceMovement = closingPrices.filter(dataPoint => {
                    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
                    const closingDate = new Date(dataPoint.closingDate * 1000);
                    
                    return closingDate >= startOfYear && closingDate <= currentDate;
                });

                setTimeFrame("YTD");
                formatClosingDate(yearToDatePriceMovement);
                break;

            case "1Y":
                const oneYearPriceMovement = filterPriceMovementByTimeFrame(currentDate, closingPrices, 1);
                setTimeFrame("1Y")
                formatClosingDate(oneYearPriceMovement);
                break;

            case "2Y":
                const twoYearPriceMovement = filterPriceMovementByTimeFrame(currentDate, closingPrices, 2);
                setTimeFrame("2Y")
                formatClosingDate(twoYearPriceMovement);
                break;

            case "5Y":
                const fiveYearPriceMovement = filterPriceMovementByTimeFrame(currentDate, closingPrices, 5);
                setTimeFrame("5Y")
                formatClosingDate(fiveYearPriceMovement);
                break;

            case "Max":
                setTimeFrame("Max")
                formatClosingDate(closingPrices);
                break;

        }
    }

    return(
        <div className="flex justify-between w-44 mt-5 mb-5">
        <button
            onClick={() => { displayChartByTimeframe("YTD") }}
            className={timeFrame === "YTD" ? "border-2 border-gray-500 rounded-lg p-1" : ""}>
            YTD
        </button>

        <button
            onClick={() => { displayChartByTimeframe("1Y") }}
            className={timeFrame === "1Y" ? "border-2 border-gray-500 rounded-lg p-1" : ""}
        >
            1Y
        </button>

        <button
            onClick={() => { displayChartByTimeframe("2Y") }}
            className={timeFrame === "2Y" ? "border-2 border-gray-500 rounded-lg p-1" : ""}>
            2Y
        </button>

        <button
            onClick={() => { displayChartByTimeframe("5Y") }}
            className={timeFrame === "5Y" ? "border-2 border-gray-500 rounded-lg p-1" : ""}>
            5Y
        </button>

        <button
            onClick={() => { displayChartByTimeframe("Max") }}
            className={timeFrame === "Max" ? "border-2 border-gray-500 rounded-lg p-1" : ""}>
            Max
        </button>
    </div>
    )
}