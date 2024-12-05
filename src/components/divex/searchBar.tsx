import * as React from "react"
import { fetchStocksBySearchTerm } from "@/api/stocks";
import { Stock } from "@/divextypes/types";
import { useEffect, useState } from "react";
import { Input } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {

    //SEARCH STATES
    const [searchValue, setSearchValue] = useState("");
    const [searchResults, setSearchResults] = useState<Stock[]>([])



    useEffect(() => {
        async function fetchAndSetResults() {
            try {
                const results = await fetchStocksBySearchTerm(searchValue);
                if (results) {
                    setSearchResults(results);
                }
            } catch (error) {
                console.error(error);
            }
        }

        if (searchValue) {
            fetchAndSetResults();
        } else {
            setSearchResults([]);
        }
    }, [searchValue]);


    // Should propably use prop drilling?
    const navigate = useNavigate();
    function showStockDetails(ticker: string) {
        navigate("/stocks/" + ticker);
    }

    return (
        <>
            {/* TODO FIX BG COLOR TO MATCH THEMEPROVIDER */}
            <div className="relative w-full max-w-md ml-auto">
                <Input
                    id="search"
                    placeholder="Search..."
                    type="search"
                    className="p-2 border-2 border-gray-400 w-full rounded-lg bg-primary-foreground"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />

                {searchResults.length > 0 && (
                    <div
                        className="absolute left-0 w-full border-2 border-gray-400 bg-white z-50 shadow-lg overflow-y-auto"
                        style={{
                            maxHeight: "calc(100vh - 300px)", // Adjust the dropdown height to fit within the viewport
                        }}
                    >
                        <div className="flex flex-col items-start">
                            {searchResults.map((stock) => (
                                <div
                                    onClick={() => showStockDetails(stock.ticker)}
                                    key={stock.ticker}
                                    className="w-full p-2 hover:underline cursor-pointer border-b last:border-none bg-primary-foreground"
                                >
                                    <h1 className="flex justify-start font-semibold">{stock.name}</h1>
                                    <h3 className="flex justify-start text-sm text-gray-500">{stock.ticker}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {searchValue && searchResults.length === 0 && (
                    <div className="flex flex-col items-start absolute w-full border-2 border-gray-400 bg-white z-50 shadow-lg p-4">
                        <p>No results found for "{searchValue}".</p>
                    </div>
                )}

            </div>
        </>
    )
}