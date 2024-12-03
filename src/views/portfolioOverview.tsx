import * as React from "react";

import { z } from "zod";
import { toast } from "sonner";
import { makeAuthOption, checkHttpsErrors } from "@/js/util";
import { useState, useEffect, useContext } from "react";
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

const URL = "http://localhost:8080/api/v1/portfolio";

const formSchema = z.object({
  portfolioName: z
    .string()
    .min(1, { message: "Name must be at least 1 character long" }),
});


export default function PortfolioOverview() {
  // PORTFOLIO STATES
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio>();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
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

  async function fetchPortfolios() {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return [];
    }
    try {
      const getOption = makeAuthOption("GET", null, token);
      const res = await fetch(URL, getOption);
      await checkHttpsErrors(res);
      const portfolios = await res.json();

      return portfolios;

    } catch (error) {
      console.error("Fetch portfolios error", error);
      toast.error(error.message);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }
    try {
      const postOption = makeAuthOption("POST", values, token);
      const res = await fetch(URL, postOption);
      await checkHttpsErrors(res);

      toast.success("Portfolio created.");

      // Add new portfolio to the list without fetching all portfolios again
      const newPortfolio = await res.json();
      setPortfolios((prevPortfolios) => [
        ...prevPortfolios,
        newPortfolio
      ]);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error(error.message);
    }
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


  console.log("TEEEEEEEEEEEEEEEESTS1", selectedPortfolio)
  console.log("TEEEEEEEEEEEEEEEESTS2", selectedPortfolio?.portfolioEntries)
  console.log("TEEEEEEEEEEEEEEEESTS3", selectedPortfolio?.portfolioEntries?.length > 0)

  return (
    <>
      <div className="flex flex-row items-center gap-4">
        <h1 className="text-semibold text-5xl">Portfolio</h1>
      </div>

      <div className="flex flex-row items-center gap-4 mt-5">
        <div className="content-center">
          <PortfolioSelect
            portfolioList={portfolios}
            selectedPortfolio={selectedPortfolio}
            setSelectedPortfolio={setSelectedPortfolio}
          />
        </div>
        <div className="ml-1 content-center">

          <CreatePortfolioButton
            onSubmit={onSubmit}
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
                  // onClick={showStockDetails()}
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
        </div>
      </div>



      <div>
        {portfolios === undefined || portfolios.length === 0 && (
          <h1 className="text-4xl font-semibold">Create a portfolio to get started</h1>
        )}
      </div>

      <div>

        {selectedPortfolio !== undefined && (
          <div className='w-full bg-primary-foreground shadow-md rounded-lg p-6 mt-5'>
            <h1 className="text-4xl font-semibold mb-12">Add stocks to the portfolio</h1>
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
                      <TableRow key={entry.id}>
                        <TableCell className="text-start font-medium">{entry.stock.ticker}</TableCell>
                        <TableCell className="text-start font-medium">{entry.stock.name}</TableCell>
                        <TableCell className="text-start font-medium">{entry.stock.currency}</TableCell>
                        <TableCell className="text-start font-medium">{entry.numberOfShares}</TableCell>
                        <TableCell className="text-start font-medium">
                          {((latestClosingPrice || 0) * entry.numberOfShares).toFixed(2)}
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
