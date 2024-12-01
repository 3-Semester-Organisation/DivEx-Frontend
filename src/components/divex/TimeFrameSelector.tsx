import * as React from "react"

interface PriceMovement {
    previousDailyClosingPrice: number
    closingDate: number

}

export default function TimeFrameSelector(closingPrices: PriceMovement[], timeFrame, setTimeFrame, formatClosingDate) {
    
    function filterPriceMovementByTimeFrame(curentDate: Date, closingPrices, yearsPrior: number) {
        const previousYearsBack = new Date();
        previousYearsBack.setFullYear(curentDate.getFullYear() - yearsPrior);

        const filteredData = closingPrices.filter(dataPoint => {
            const closingDate = dataPoint.closingDate;

            console.log("curentDate", curentDate)
            console.log("tWOOOO", previousYearsBack)

            return (closingDate >= previousYearsBack.getTime()) && (closingDate <= curentDate.getTime());
        })

        return filteredData;
    }


    function displayChartByTimeframe(timeFrame: string) {

        const currentDate = new Date();

        switch (timeFrame) {
            case "YTD":
                console.log(closingPrices.closingPrices)
                const yearToDatePriceMovement = closingPrices.filter(dataPoint => {
                    const startOfYear = new Date(currentDate.getFullYear(), 1, 1).getTime(); // Start of the current year in milliseconds
                    return dataPoint.closingDate >= startOfYear && dataPoint.closingDate <= Date.now();
                });
                setTimeFrame("YTD")
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
        <div className="flex justify-between w-44">
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