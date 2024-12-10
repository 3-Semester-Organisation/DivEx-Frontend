import { PortfolioEntry } from '@/divextypes/types';
import { usePortfolios } from '@/js/PortfoliosContext';
import { stockCurrencyConverter } from '@/js/util';
import * as React from 'react'
import { useState, useEffect } from 'react'
import { Bar, BarChart, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import MonthSelector from './MonthSelector';


interface DividendData {
    stockName: string;
    dividendRate: number;
    payoutFrequenzyAprox: number;
    dividendAmount: number;
    exDividendDate: string;
    currency: string;
}



export default function dividendBarChart({ currency }) {

    const { selectedPortfolio } = usePortfolios();
    const [latestDividendData, setLatestDividendData] = useState<DividendData[]>([])
    const [filteredDividendData, setFilteredDividendData] = useState<DividendData[]>([])
    const [selectedMonth, setSelectedMonth] = useState<number>();

    function convertUnixToDateString(unixDate: number) {
        return new Date(unixDate * 1000).toDateString();
    }

    // function getCurrentMonth() {
    //     return new Date().toDateString().split(" ")[1]
    // }

    function getCurrentMonthIndex() {
        return new Date().getMonth();
    }

    useEffect(() => {
        function populateDividendDataState() {

            const dividendData = selectedPortfolio.portfolioEntries.map(entry => ({
                stockName: entry.stock.name,
                dividendRate: entry.stock.dividendRate,
                payoutFrequenzyAprox: calculatePayoutFrequenzy(entry),
                exDividendDate: convertUnixToDateString(entry.stock.exDividendDate),
                dividendAmount: (stockCurrencyConverter(entry.stock.dividendRate, entry, currency) / calculatePayoutFrequenzy(entry)).toFixed(2),
                currency: entry.stock.currency
            }));
            setLatestDividendData(dividendData);
        }

        populateDividendDataState();
        setSelectedMonth(getCurrentMonthIndex());
        filterDividendsBySelectedMonth(getCurrentMonthIndex());
    }, [selectedPortfolio, currency])

    function filterDividendsBySelectedMonth(index: number) {
        const filteredDividends = latestDividendData.filter(dividendData => new Date(dividendData.exDividendDate).getMonth() === index)
        setFilteredDividendData(filteredDividends);
    }

    function calculatePayoutFrequenzy(portfolioEntry: PortfolioEntry) {
        let payoutFrequenzy = 0;

        const historicalDividends = portfolioEntry.stock.historicalDividends;
        const lastIndex = historicalDividends.length - 1;
        const SECONDS_CONVERSION_VALUE = 1000;

        const latestExDate = new Date(portfolioEntry.stock.exDividendDate * SECONDS_CONVERSION_VALUE).getMonth();
        const previousExDate = new Date(historicalDividends[lastIndex - 1].exDividendDate * SECONDS_CONVERSION_VALUE).getMonth();
        const priorExDate = new Date(historicalDividends[lastIndex - 2].exDividendDate * SECONDS_CONVERSION_VALUE).getMonth();

        let isYearly: boolean = latestExDate === previousExDate;
        let isHalfYearly: boolean = latestExDate === priorExDate;
        let isQuartly: boolean = false;
        
        console.log("LATEST", latestExDate)
        console.log("previous", previousExDate)
        console.log("piror", priorExDate)

        if (isYearly) {
            payoutFrequenzy = 1;

        } else if (isHalfYearly) {
            payoutFrequenzy = 2;

        } else {
            isQuartly = true;
            payoutFrequenzy = 4;
        }

        return payoutFrequenzy;
    }

    function totalDividendsBySelectedMonth() {
        let totalDividends = 0;

        filteredDividendData.forEach(dividendData =>
            totalDividends += Number(dividendData.dividendAmount)
        )

        return totalDividends;
    }

    return (
        <>
            <div className='flex flex-col ml-5 bg-primary-foreground h-full rounded-lg shadow-lg'>
                {filteredDividendData.length === 0 && (
                    <p className='font-semibold text-2xl mt-52'>No dividends for this month.</p>
                )}

                {filteredDividendData.length > 0 && (
                    <h2 className='flex justify-start font-semibold text-lg p-4'>
                        Expected dividends this month:
                        <span className="ml-2 mr-1 text-green-700">{currency}</span>
                        <span className="text-green-700">{totalDividendsBySelectedMonth()}</span>
                    </h2>
                )}

                <div className="flex-grow w-full h-0">
                    {filteredDividendData.length > 0 && (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                className="flex-1 p-5"
                                data={filteredDividendData}
                            >
                                <XAxis dataKey="stockName" padding={{ right: 500 }} />
                                <YAxis dataKey="dividendAmount"/>
                                <Tooltip content={<DividendChartToolTip selectedCurrency={currency} />} />
                                <Bar dataKey="dividendAmount" fill="#183e7a" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <MonthSelector
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                    filterDividendsBySelectedMonth={filterDividendsBySelectedMonth}
                />
            </div>
        </>
    )
}

function DividendChartToolTip({ active, payload, label, selectedCurrency }) {
    if (active && payload && payload.length) {
        const { exDividendDate, dividendRate, dividendAmount, currency } = payload[0].payload; // Access stockName from payload

        return (
            <div className="p-4 bg-primary-foreground flex flex-col gap-0 rounded-md border-2 border-gray-600 w-auto">
                <h1 className="text-medium text-lg w-auto mb-1">{label}</h1>
                <div className="flex justify-start flex-col text-small text-gray-500">
                    <p className='flex justify-start'>Dividends: <span className="ml-2">{dividendAmount} {selectedCurrency}</span></p>
                    <p className='flex justify-start'>Dividend Rate: <span className="ml-2">{dividendRate} {currency}</span></p>
                    <p className='flex justify-start'>Ex Date: <span className="ml-2">{exDividendDate}</span> </p>
                </div>
            </div>
        );
    }

    return null;
}
