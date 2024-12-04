"use client";

import * as React from "react";
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
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

interface Portfolio {
  id: string;
  name: string;
}

interface PortfolioSelectProps {
  portfolioList: Portfolio[];
  selectedPortfolio: Portfolio | null;
  setSelectedPortfolio: React.Dispatch<React.SetStateAction<Portfolio | null>>;
}

export function PortfolioSelect({
  portfolioList,
  selectedPortfolio,
  setSelectedPortfolio,
}: PortfolioSelectProps) {
  const [open, setOpen] = useState(false);
  const portfolios = portfolioList;

  // Handles the selection of a portfolio
  // Adds the entire portfolio object to local storage
  const handleSelect = (currentValue: string) => {
    if (selectedPortfolio === null) { 
      toast.error("No portfolio selected.");
    }
    const newPortfolio = portfolios.find((portfolio) => portfolio.id === currentValue);
    if (newPortfolio) {
      setSelectedPortfolio(newPortfolio);
      setOpen(false);

      localStorage.setItem("selectedPortfolio", JSON.stringify(newPortfolio));
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          className="flex w-[200px] justify-between"
        >
          {selectedPortfolio
            ? selectedPortfolio.name
            : "Select portfolio"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search portfolios..." />
          <CommandList>
            <CommandEmpty>No portfolio found.</CommandEmpty>
            <CommandGroup>
              {portfolios.map((portfolio) => (
                <CommandItem
                  key={portfolio.id}
                  value={portfolio.id}
                  onSelect={() => handleSelect(portfolio.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedPortfolio?.id === portfolio.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {portfolio.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}