"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
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

export function PortfolioSelect({
  portfolioList,
  selectedPortfolio,
  setSelectedPortfolio
}) {

  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState("");
  const [name, setName] = React.useState("");
  const portfolios = portfolioList;

  React.useEffect(() => {
    setId(selectedPortfolio);
    setName(selectedPortfolio);
  }, [selectedPortfolio]);

  // handles the selection of a portfolio
  // adds portfolio id to local storage
  const handleSelect = (selectedPortfolio) => {
    const newValue = selectedPortfolio.id === id ? "" : selectedPortfolio.id;
    setId(newValue);
    setSelectedPortfolio(selectedPortfolio);
    setOpen(false);

    localStorage.setItem("selectedPortfolio", JSON.stringify(selectedPortfolio));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          className="flex w-[200px] justify-between bg-accent-foreground "
        >
          {name ? portfolios.find((portfolio) => portfolio.name === name)?.name : "Select portfolio"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No portfolio found.</CommandEmpty>
            <CommandGroup>
              {portfolios.map((portfolio) => (
                <CommandItem
                  key={portfolio.id}
                  value={portfolio}
                  onSelect={ () => handleSelect(portfolio)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      id === portfolio.id ? "opacity-100" : "opacity-0"
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
