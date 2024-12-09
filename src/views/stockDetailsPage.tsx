import React, { useEffect, useState } from 'react'
import DividendInfo from '@/components/divex/DividendInfo'
import StockGraph from '@/components/divex/StockGraph'
import { useParams } from 'react-router-dom';
import { checkHttpsErrors } from '@/js/util'
import HistoricalDividendChart from '@/components/divex/HistoricalDividendChart';
import AddStockModal from '@/components/divex/AddStockModal';
import { AddStockDialog } from '@/components/ui/custom/add-stock-dialog';
import { Stock } from '@/divextypes/types';

import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { usePortfolios } from '@/js/PortfoliosContext';
import { toast } from 'sonner';


export default function StockDetailsPage() {
    const navigate = useNavigate();

    const { ticker } = useParams();
    const [stock, setStock] = useState(null);

    const [isAddingStock, setIsAddingStock] = useState(false);
    const [stockToAdd, setStockToAdd] = useState<Stock>(null);

    const { portfolios, setPortfolios } = usePortfolios();

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

    function showModal(stock: Stock, event: React.MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();
        if (portfolios.length === 0) {
            console.log("no portfolios detected")
            toast.error("You need to create a portfolio first.");
            return;
        } else {
            setStockToAdd(stock);
            setIsAddingStock(true);
        }

        
    }

    return (
        <>
            <AddStockModal 
            stock={stock}
            setIsAddingStock={setIsAddingStock}
            stockToAdd={stockToAdd}
            isAddingStock={isAddingStock}
            />

            <div className="flex p-4">
                <Button variant="ghost" onClick={() => navigate(-1)}><ChevronLeft />Go back</Button>
            </div>

            <div className="">
                {stock === null ? (
                    <p>Loading...</p>
                ) : (
                    <div>
                        <div className="flex justify-between gap-3 mt-5">
                            <h1 className="ml-6 font-bold text-3xl">{stock.name}</h1>
                                <p className="mt-3 mr-auto">{`(${stock.ticker.toUpperCase()})`}</p>
                                {/* NEW COMPONENT */}
                                <AddStockDialog
                                    stock={stock}
                                />
                            <button
                                onClick={(event) => showModal(stock, event)}
                                className="px-4 py-2 bg-primary-foreground hover:underline rounded-lg border-2 border-gray-400">
                                Add
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