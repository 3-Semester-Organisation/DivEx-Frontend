"use client";

import * as React from "react";
import { useEffect } from "react";

import { z } from "zod";
import { toast } from "sonner";
import { makeAuthOption, checkHttpsErrors } from "@/js/util";

import { PortfolioSelect } from "@/components/ui/custom/portfolioSelect";
import { CreatePortfolioButton } from "@/components/ui/custom/createPortfolioButton";

import { AuthContext } from "@/js/AuthContext";
import StockTable from "@/components/ui/custom/stockTable";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

import { fetchPaginatedStocks } from "@/api/stocks";
import PaginationBar from "@/components/divex/PaginationBar";
import { PortfolioEditDialog } from "@/components/ui/custom/portfolioEditDialog";
import { fetchUpdatePortfolioName } from "@/api/portfolio";

const URL = "http://localhost:8080/api/v1/portfolio";

const formSchema = z.object({
  portfolioName: z
    .string()
    .min(1, { message: "Name must be at least 1 character long" }),
});

interface Portfolio {
  id: string;
  name: string;
}

export default function PortfolioOverview() {
  // PORTFOLIO STATES
  const [selectedPortfolio, setSelectedPortfolio] = React.useState<Portfolio | null>(() => {
    const stored = localStorage.getItem("selectedPortfolio");
    return stored ? JSON.parse(stored) : null;
  });
  const [portfolios, setPortfolios] = React.useState<Portfolio[]>([]); 

  // AUTH CONTEXT
  const { subscriptionType } = React.useContext(AuthContext);

  // TABLE STATES
  const [sorting, setSorting] = React.useState({ column: "", direction: "asc" });
  const [stocks, setStocks] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  // PAGINATION STATES
  const [currentPage, setCurrentPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);

  // Limit amount of portfolios based on subscription type
  function handleCreateButtonClick() {
    if (subscriptionType === "FREE" && portfolios.length >= 1) {
      toast.error("Free users can only have one portfolio.");
      return false;
    }
    else if (subscriptionType === "PREMIUM" && portfolios.length >= 10) {
      toast.error("Premium users can only have up to 10 portfolios.");
      return false;
    }
    return true;
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
      const data = await res.json();
      const portfolioList = data.map((portfolio: any) => ({
        id: portfolio.id.toString(),
        name: portfolio.name,
      }));
      return portfolioList;
    } catch (error: any) {
      console.error("Fetch portfolios error", error);
      toast.error(error.message);
      return [];
    }
  }

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
      const res = await fetchUpdatePortfolioName(newName, selectedPortfolio.id);
      await checkHttpsErrors(res);

      // Update local state
      const updatedPortfolio = { ...selectedPortfolio, name: newName };
      setSelectedPortfolio(updatedPortfolio);
      setPortfolios((prevPortfolios) =>
        prevPortfolios.map((portfolio) =>
          portfolio.id === updatedPortfolio.id ? updatedPortfolio : portfolio
        )
      );

      // Update localStorage
      localStorage.setItem("selectedPortfolio", JSON.stringify(updatedPortfolio));

      toast.success("Portfolio name updated.");
      return res;
    } catch (error: any) {
      console.error("Update portfolio name error", error);
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
      const formattedPortfolio: Portfolio = {
        id: newPortfolio.id.toString(),
        name: newPortfolio.name,
      };
      setPortfolios((prevPortfolios) => [
        ...prevPortfolios,
        formattedPortfolio,
      ]);

      // Optionally, set the new portfolio as selected
      setSelectedPortfolio(formattedPortfolio);
      localStorage.setItem("selectedPortfolio", JSON.stringify(formattedPortfolio));
    } catch (error: any) {
      console.error("Form submission error", error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    async function loadPortfolios() {
      const data = await fetchPortfolios();
      setPortfolios(data || []);

      // If no portfolio is selected, optionally select the first one
      if (!selectedPortfolio && data && data.length > 0) {
        setSelectedPortfolio(data[0]);
        localStorage.setItem("selectedPortfolio", JSON.stringify(data[0]));
      }
    }
    loadPortfolios();
  }, []);

  // TABLE HANDLING
  function handleSortClick(column: string) {
    setSorting((prevSorting) => ({
      column: column,
      direction:
        prevSorting.column === column && prevSorting.direction === "asc"
          ? "desc"
          : "asc",
    }));
    setCurrentPage(0); // Reset to first page on sort
    console.log(`Sorting by ${column} in ${sorting.direction === "asc" ? "descending" : "ascending"} order.`);
  }

  useEffect(() => {
    async function loadStocks() {
      try {
        setIsLoading(true);
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const paginatedStocks = await fetchPaginatedStocks(
          currentPage,
          10,
          sorting
        );
        setStocks(paginatedStocks.content);
        setTotalPages(paginatedStocks.totalPages);
      } catch (error: any) {
        console.error("Load stocks error", error);
        toast.error("Failed to load stocks.");
      } finally {
        setIsLoading(false);
      }
    }
    loadStocks();
  }, [currentPage, sorting]);

  return (
    <>
      <div className="flex flex-row group">
        <div className="relative">
          <h1 className="text-semibold flex text-5xl">{selectedPortfolio ? selectedPortfolio.name : "Select a portfolio"}
            <PortfolioEditDialog
              onSubmit={changePortfolioName}
              selectedPortfolio={selectedPortfolio}
            />
          </h1>
        </div>
        <div className="ml-10 mt-2">
          <PortfolioSelect
            portfolioList={portfolios}
            selectedPortfolio={selectedPortfolio}
            setSelectedPortfolio={setSelectedPortfolio}
          />
        </div>
        <div className="ml-1 content-center mt-2">

          <CreatePortfolioButton
            onSubmit={onSubmit}
            handleCreateButtonClick={handleCreateButtonClick}
          />
        </div>
      </div>
      <p>Selected portfolio id: {selectedPortfolio?.name}</p>{/* This is just for debugging */}

      <div className="flex flex-col">
      <StockTable
        stocks={stocks}
        sorting={sorting}
        onSortClick={handleSortClick}
        isLoading={isLoading}
          />
      <PaginationBar
        currentPage={currentPage}  
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
      </div>
    </>
  );
}