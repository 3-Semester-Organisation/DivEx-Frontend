import * as React from "react";

import { z } from "zod";
import { toast } from "sonner";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { Stock, Portfolio } from "@/divextypes/types";

import { PortfolioSelect } from "@/components/ui/custom/portfolioSelect";
import { CreatePortfolioButton } from "@/components/ui/custom/createPortfolioButton";

import { Input } from "@/components/ui/input";
import { AuthContext } from "@/js/AuthContext";

import { fetchStocksBySearchTerm } from "@/api/stocks";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePortfolios } from "@/js/PortfoliosContext";
import { createPortfolio, fetchPortfolios } from "@/api/portfolio";



export default function PortfolioOverview() {
  // PORTFOLIO STATES
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio>();
  const { portfolios, setPortfolios } = usePortfolios();
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<Stock[]>([])


  // AUTH CONTEXT
  const { subscriptionType } = useContext(AuthContext);


  // limit amount of portfolios based on subscription type
  function handleCreateButtonClick() {
    if (portfolios.length >= 1 && subscriptionType === "FREE") {
      toast.error("Free users can only have one portfolio.");
      return false;
    }
    else if (portfolios.length >= 10 && subscriptionType === "PREMIUM") {
      toast.error("Premium users can only have up to 10 portfolios.");
      return false;
    }
  }

  async function handlePortfolioCreation(values) {
    const newPortfolio = await createPortfolio(values);

    setPortfolios((prevPortfolios) => [
      ...prevPortfolios,
      newPortfolio
    ]);
  }


  useEffect(() => {
    async function loadPortfolios() {
      const data = await fetchPortfolios();
      setPortfolios(data || []);
    }
    loadPortfolios();
  }, []);


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
    navigate("/stocks/" + ticker, { state: portfolios });
  }

  // console.log("aaaaaaaaaaaaaaaaa", portfolios)


  console.log("TEEEEEEEEEEEEEEEESTS1", selectedPortfolio)

  // selectedPortfolio.portfolioEntries.map((entry) => {
  //   const historicalPricing = entry.stock.historicalPricing ?? []; // Default to empty array if undefined
  //   const lastElementIndex = historicalPricing.length - 1;
  //   const latestClosingPrice = historicalPricing[lastElementIndex]?.previousDailyClosingPrice ?? 0;


  //   console.log("historicval pricing", historicalPricing)
  //   console.log("lastElementIndex", lastElementIndex)
  //   console.log("latest closingprice", latestClosingPrice)
  // })


  // console.log("TEEEEEEEEEEEEEEEESTS2", selectedPortfolio?.portfolioEntries)
  // console.log("TEEEEEEEEEEEEEEEESTS3", selectedPortfolio?.portfolioEntries?.length > 0)
console.log("portfolios", portfolios)
  return (
    <>
      <div className="flex flex-row items-center gap-4">
        <h1 className="text-semibold text-5xl">Portfolio</h1>
      </div>

      <div className="flex flex-row items-center gap-4 mt-5">

        {portfolios !== undefined && (
          <div className="content-center">
            <PortfolioSelect
              portfolioList={portfolios}
              selectedPortfolio={selectedPortfolio}
              setSelectedPortfolio={setSelectedPortfolio}
            />
          </div>
        )}

        <div className="ml-1 content-center">
          <CreatePortfolioButton
            onSubmit={handlePortfolioCreation}
            handleCreateButtonClick={handleCreateButtonClick}
          />
        </div>

        {/* TODO FIX BG COLOR TO MATCH THEMEPROVIDER */}
        <div className="relative w-full max-w-md ml-auto">
          <Input
            id="search"
            placeholder="Search..."
            type="search"
            className="p-4 border-2 border-gray-400 w-full"
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
                    className="w-full p-2 hover:bg-gray-100 cursor-pointer border-b last:border-none"
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
      </div>



      <div>
        {portfolios === undefined && (
          <h1 className="text-4xl font-semibold">Create a portfolio to get started</h1>
        )}
      </div>

      <div>

        {selectedPortfolio !== undefined && (
          <div className='w-full bg-primary-foreground shadow-md rounded-lg p-6 mt-5'>
            <h1 className="flex justify-start font-semibold text-2xl ml-1 mb-6">{selectedPortfolio.name}</h1>

            {selectedPortfolio?.portfolioEntries?.length === 0 || selectedPortfolio?.portfolioEntries?.length === undefined && (
              <h1 className="text-4xl font-semibold mb-12">Add stocks to the portfolio</h1>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticker</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>no. shares</TableHead>
                  <TableHead>value</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {selectedPortfolio?.portfolioEntries?.length > 0 && (
                  selectedPortfolio.portfolioEntries.map((entry) => {
                    const historicalPricing = entry.stock.historicalPricing ?? []; // Default to empty array if undefined
                    const lastElementIndex = historicalPricing.length - 1;
                    const latestClosingPrice = historicalPricing[lastElementIndex]?.previousDailyClosingPrice ?? 0;

                    return (
                      <TableRow key={entry.stock.ticker}>
                        <TableCell className="text-start font-medium">{entry.stock.ticker}</TableCell>
                        <TableCell className="text-start font-medium">{entry.stock.name}</TableCell>
                        <TableCell className="text-start font-medium">{entry.stock.currency}</TableCell>
                        <TableCell className="text-start font-medium">{entry.quantity}</TableCell>
                        <TableCell className="text-start font-medium">
                          {new Intl.NumberFormat('en-US').format((latestClosingPrice || 0) * entry.quantity)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}
