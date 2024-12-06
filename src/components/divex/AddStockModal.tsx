// add these import to seperate component buy BTN
import * as React from 'react'
import { Portfolio, PortfolioEntryRequest } from '@/divextypes/types';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { addStockToPortfolio } from "@/api/portfolio"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { usePortfolios } from '@/js/PortfoliosContext';
import { AuthContext } from '@/js/AuthContext';



const addStockSchema = z.object({
    stockPrice: z.number().gt(0, { message: "Stock price must be greater than 0" }),
    quantity: z.number().min(1, { message: "Quantity must atlest be 1" }),
});


export default function AddStockModal({ stock, setIsAddingStock, stockToAdd, isAddingStock }) {


    const [addStockData, setAddStockData] = useState({
        stockPrice: 0,
        quantity: 0
    })
    const { portfolios } = usePortfolios();
    const [selectedPortfolioId, setSelectedPortfolioId] = useState<number>();
    const { subscriptionType } = React.useContext(AuthContext);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");




    function cancel(event: React.MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();
        setIsAddingStock(false);
    }


    function addStock(event: React.MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();
        event.preventDefault();

        if (!token) {
            setIsAddingStock(false);
            navigate("/login");
            return;
        }

        //form validation
        if (selectedPortfolioId === 0 || selectedPortfolioId === undefined) {
            toast("Select a portfolio");
            return;
        }
        const validation = addStockSchema.safeParse(addStockData);
        if (!validation.success) {
            // Display validation error messages
            validation.error.errors.forEach((err) => toast.error(err.message));

            return;
        }

        //stock limit validation

        if (subscriptionType === "FREE") {
            //TODO make use of selected portfolio in the Portfolio contex when it gets merged.
            const PORTFOLIO_ENTRY_LIMIT = 3;
            const selectedPortfolio: Portfolio = portfolios.find(portfolio => portfolio.id === selectedPortfolioId)
            const portfolioEntries = selectedPortfolio.portfolioEntries.length

            if (portfolioEntries === PORTFOLIO_ENTRY_LIMIT) {
                toast(`Portfolio limit of ${PORTFOLIO_ENTRY_LIMIT} reached for free users. Upgrade to premium for unlimited entries.`);
                return;
            }
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
                setIsAddingStock(false);
            }

        } catch (error) {
            console.error(error);
            toast(error.message);
        }

    }


    function handleSelectedPortfolio(portfolioId: number) {
        setSelectedPortfolioId(portfolioId);
    }

    return (
        <div className="relative">
            {/* Backdrop */}
            {isAddingStock && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"></div>
            )}

            {/* Modal (Centered Card) */}
            {isAddingStock && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <Card className="w-[15%] max-w-md shadow-lg bg-primary-foreground rounded-lg">
                        <CardHeader>
                            <CardTitle>Adding stock</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <form className="flex flex-col">

                                <label className="mt-3 font-semibold mr-auto ml-4">Select portfolio</label>
                                <select
                                    className="p-1 border-2 border-gray-400 rounded-lg mr-4 ml-4 bg-primary-foreground"
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


                                <label className="mr-auto font-semibold ml-4 mt-4">Stock</label>
                                <input
                                    className="bg-primary-foreground p-1 border-2 border-gray-400 rounded-lg mr-4 ml-4"
                                    readOnly={true}
                                    value={stock.name}
                                />

                                <label className="mt-3 font-semibold mr-auto ml-4">Stock Price</label>
                                <input
                                    className="bg-primary-foreground p-1 border-2 border-gray-400 rounded-lg mr-4 ml-4"
                                    type="number"
                                    onChange={(event) =>
                                        setAddStockData({
                                            ...addStockData,
                                            stockPrice: parseFloat(event.target.value),
                                        })
                                    }
                                />

                                <label className="mt-3 font-semibold mr-auto ml-4">Quantity</label>
                                <input
                                    className="bg-primary-foreground p-1 border-2 border-gray-400 rounded-lg mr-4 ml-4"
                                    type="number"
                                    onChange={(event) =>
                                        setAddStockData({
                                            ...addStockData,
                                            quantity: parseFloat(event.target.value),
                                        })
                                    }
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
    )
}