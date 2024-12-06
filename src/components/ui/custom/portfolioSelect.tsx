"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { usePortfolios } from "@/js/PortfoliosContext";

import { cn } from "@/lib/utils"; // Ensure the `cn` utility is properly imported
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Portfolio } from "@/divextypes/types"; // Ensure correct path and export

interface PortfolioSelectProps {
  portfolioList: Portfolio[];
  selectedPortfolio: Portfolio | null;
  setSelectedPortfolio: (portfolio: Portfolio) => void;
}

export function PortfolioSelect({
  portfolioList = [],
  selectedPortfolio,
  setSelectedPortfolio,
}: PortfolioSelectProps) {
  const [open, setOpen] = useState(false);

  
  const handleChange = (id: string) => {
    const selectedId = id
    const portfolio = portfolioList?.find((p) => p.id.toString() === selectedId) || null;
    setSelectedPortfolio(portfolio);
    console.log("SELECTED PORTFOLIO", portfolio);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          className="flex w-[200px] justify-between"
        >
          {selectedPortfolio?.name || "Select portfolio"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search portfolios..." />
          <CommandList>
            {portfolioList.length > 0 ? (
              <CommandGroup>
                {portfolioList.map((portfolio) => (
                  <CommandItem
                    key={portfolio.id}
                    value={portfolio.name}
                    onSelect={() => handleChange(portfolio.id.toString())}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedPortfolio?.id === portfolio.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {portfolio.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <CommandEmpty>No portfolio found.</CommandEmpty>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
