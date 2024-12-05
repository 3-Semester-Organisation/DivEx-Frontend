"use client";

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
import { createPortfolio, fetchPortfolios, fetchUpdatePortfolioName } from "@/api/portfolio";

import { PortfolioEditDialog } from "@/components/ui/custom/portfolioEditDialog";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/divex/searchBar";



export default function PortfolioOverview() {
  // PORTFOLIO STATES

  const { portfolios, setPortfolios } = usePortfolios();
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);


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

      if (!selectedPortfolio && data && data.length > 0) {
        setSelectedPortfolio(data[0]);
        localStorage.setItem("selectedPortfolio", JSON.stringify(data[0]));
      }
    }

    loadPortfolios();
    setSelectedPortfolio(selectedPortfolio);
  }, []);


  const changePortfolioName = async (newName: string) => {
    const token = localStorage.getItem("token");
    if (!selectedPortfolio) {
      toast.error("No portfolio selected.");
      return;
    }
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }
    try {
      const data = await fetchUpdatePortfolioName(newName, selectedPortfolio.id);

      console.log("changedNAME",data)

      // Update local state
      const updatedPortfolio = { ...selectedPortfolio, name: data.name };
      setSelectedPortfolio(updatedPortfolio);
      setPortfolios((prevPortfolios) =>
        prevPortfolios.map((portfolio) =>
          portfolio.id === updatedPortfolio.id ? updatedPortfolio : portfolio
        )
      );

      // Update localStorage
      localStorage.setItem("selectedPortfolio", JSON.stringify(updatedPortfolio));

      toast.success("Portfolio name updated.");

    } catch (error: any) {
      console.error("Update portfolio name error", error);
      toast.error(error.message);
    }
  }


  console.log("portfolios", portfolios)
  console.log("Localstorage Ports", JSON.parse(localStorage.getItem("selectedPortfolio")))

  console.log("Selected PORTs", selectedPortfolio)


  return (
    <>
      <div className="flex flex-row items-center gap-4 mt-5">

        {portfolios !== null && (
          <div className="flex flex-col content-center">

            <div className="relative">
              <h1 className="text-semibold flex text-5xl">{selectedPortfolio ? selectedPortfolio.name : "Select a portfolio"}
                <PortfolioEditDialog
                  onSubmit={changePortfolioName}
                  selectedPortfolio={selectedPortfolio}
                />
              </h1>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <PortfolioSelect
                portfolioList={portfolios}
                selectedPortfolio={selectedPortfolio}
                setSelectedPortfolio={setSelectedPortfolio}
              />

              <div className="ml-1 content-center">
                <CreatePortfolioButton
                  onSubmit={handlePortfolioCreation}
                  portfolios={portfolios}
                />
              </div>
            </div>
          </div>
        )}

        <SearchBar />
      </div>



      <div>
        {portfolios === null && (
          <h1 className="text-4xl font-semibold">Create a portfolio to get started</h1>
        )}
      </div>

      <div>

        {selectedPortfolio !== null && (
          <div className='w-full bg-primary-foreground shadow-md rounded-lg p-6 mt-5'>

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
