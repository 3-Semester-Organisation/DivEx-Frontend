import DividendInfo from '@/components/divex/DividendInfo'
import StockGraph from '@/components/divex/StockGraph'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { checkHttpsErrors } from '@/js/util'
import * as React from 'react'
import HistoricalDividendChart from '@/components/divex/HistoricalDividendChart';

// add these import to seperate component buy BTN
import { Portfolio, PortfolioEntryRequest, Stock } from '@/divextypes/types';
import { useNavigate } from 'react-router-dom';
import { number, z } from "zod";
import { toast } from "sonner";
import { AuthContext } from "@/js/AuthContext";
import { useContext } from "react";
import { addStockToPortfolio } from "@/api/portfolio"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { usePortfolios } from '@/js/PortfoliosContext';


const addStockSchema = z.object({
    stockPrice: z.number().gt(0, { message: "Stock price must be greater than 0" }),
    quantity: z.number().min(1, { message: "Quantity must atlest be 1" }),
});


export default function StockDetailsPage() {

    const { ticker } = useParams();
    const [stock, setStock] = useState(null);

    useEffect(() => {
        async function fetchStockByTicker(ticker: string) {
            try {
                const response = await fetch("http://localhost:8080/api/v1/stock/" + ticker)
                checkHttpsErrors(response);
                const stockResponse = await response.json();

                setStock(stockResponse);

            } catch (error) {
                console.error(error);
            }
        }

        fetchStockByTicker(ticker);
    }, []);






    const [isAddingStock, setIsAddingStock] = useState(false);
    const [stockToAdd, setStockToAdd] = useState<Stock>(null);
    const [addStockData, setAddStockData] = useState({
        stockPrice: 0,
        quantity: 0
    })
    const { portfolios, setPortfolios } = usePortfolios();
    const [selectedPortfolioId, setSelectedPortfolioId] = useState<number>();


    const navigate = useNavigate();
    const { isLoggedin } = useContext(AuthContext)
    function showModal(stock: Stock, event: React.MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();

        setStockToAdd(stock);
        setIsAddingStock(true);
    }
    function cancel(event: React.MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();
        setIsAddingStock(false);
    }
    function addStock(event: React.MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();

        if (!isLoggedin) {
            setIsAddingStock(false);
            navigate("/login");
            return;
        }

        try {
            const portfolioEntryRequest: PortfolioEntryRequest = {
                ticker: stockToAdd.ticker,
                stockPrice: addStockData.stockPrice,
                quantity: addStockData.quantity,
                portfolioId: selectedPortfolioId
            }

            const isAdded = addStockToPortfolio(portfolioEntryRequest);
            if (isAdded) {
                toast("Stock was added to the succesfully portfolio")
            }

        } catch (error) {
            console.error(error);
            toast(error.message);
        }
        finally {
            setIsAddingStock(false);
        }

    }
    function handleSelectedPortfolio(portfolioId: number) {
        setSelectedPortfolioId(portfolioId);
    }
    console.log("ID", selectedPortfolioId)
    console.log("ssssssssssssssssssssssssss", isAddingStock)

    return (
        <>
            <div className="relative">
                {/* Backdrop */}
                {isAddingStock && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"></div>
                )}

                {/* Modal (Centered Card) */}
                {isAddingStock && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <Card className="w-[15%] max-w-md shadow-lg bg-white rounded-lg">
                            <CardHeader>
                                <CardTitle>Adding stock</CardTitle>
                            </CardHeader>

                            <CardContent>
                                <form className="flex flex-col">

                                    <label className="mt-3 font-semibold mr-auto ml-4">Select portfolio</label>
                                    <select
                                        className="p-1 border-2 border-gray-400 rounded-lg mr-4 ml-4"
                                        onChange={(event) => handleSelectedPortfolio(parseInt(event.target.value))}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>
                                            Select a portfolio
                                        </option>
                                        {portfolios.map((portfolioOption) => (
                                            <option key={portfolioOption.id} value={portfolioOption.id}>
                                                {portfolioOption.name}
                                            </option>
                                        ))}
                                    </select>


                                    <label className="mr-auto font-semibold ml-4">Stock</label>
                                    <input
                                        className="p-1 border-2 border-gray-400 rounded-lg mr-4 ml-4"
                                        readOnly={true}
                                        value={stock.name}
                                    />

                                    <label className="mt-3 font-semibold mr-auto ml-4">Stock Price</label>
                                    <input
                                        type="number"
                                        onChange={(event) =>
                                            setAddStockData({
                                                ...addStockData,
                                                stockPrice: parseFloat(event.target.value),
                                            })
                                        }
                                        className="p-1 border-2 border-gray-400 rounded-lg mr-4 ml-4"
                                    />

                                    <label className="mt-3 font-semibold mr-auto ml-4">Quantity</label>
                                    <input
                                        type="number"
                                        onChange={(event) =>
                                            setAddStockData({
                                                ...addStockData,
                                                quantity: parseFloat(event.target.value),
                                            })
                                        }
                                        className="p-1 border-2 border-gray-400 rounded-lg mr-4 ml-4"
                                    />

                                    <div className="flex items-center justify-center gap-6 mt-6">
                                        <button
                                            onClick={(event) => cancel(event)}
                                            className="p-2 bg-primary-foreground hover:underline rounded-lg border-2 border-gray-400">
                                            Cancel
                                        </button>

                                        <button
                                            onClick={(event) => addStock(event)}
                                            className="p-2 px-4 bg-primary-foreground hover:underline rounded-lg border-2 border-gray-400">
                                            Add
                                        </button>
                                    </div>
                                </form>

                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="">
                {stock === null ? (
                    <p>Loading...</p>
                ) : (
                    <div>
                        <div className="flex justify-between gap-3 mt-5">
                            <h1 className="ml-6 font-bold text-3xl">{stock.name}</h1>
                            <p className="mt-3 mr-auto">{`(${stock.ticker.toUpperCase()})`}</p>
                            <button
                                onClick={(event) => showModal(stock, event)}
                                className="px-4 py-2 bg-primary-foreground hover:underline rounded-lg border-2 border-gray-400">
                                Add
                            </button>

                            <button className="mr-4 px-4 py-2 bg-primary-foreground hover:underline rounded-lg border-2 border-gray-400">
                                Remove
                            </button>
                        </div>

                        <div className="flex gap-6 p-4">
                            <DividendInfo stock={stock} />
                            <StockGraph stock={stock} />
                        </div>

                        <div className="flex flex-col justify-center items-center bg-primary-foreground shadow-md rounded-lg p-4 mt-1 ml-4 mr-4">
                            <h2 className="font-bold text-2xl">Historical Dividend Chart</h2>
                            <HistoricalDividendChart stock={stock} />
                        </div>
                    </div>
                )}
            </div>
        </>
    );

}