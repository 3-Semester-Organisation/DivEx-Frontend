import React, { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PortfoliosContext, usePortfolios } from "@/js/PortfoliosContext";
import { AuthContext } from "@/js/AuthContext";
import { addStockToPortfolio } from "@/api/portfolio";
import { set } from "date-fns";

export function AddStockDialog({
  stock,
  setIsAddingStock,
  stockToAdd,
  isAddingStock,
}) {
  const [open, setOpen] = useState(false);

  const [addStockData, setAddStockData] = useState({
    stockPrice: 0,
    quantity: 0,
  });

  const { portfolios } = usePortfolios();
  const { selectedPortfolio } = useContext(PortfoliosContext);
  const { subscriptionType } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  if (subscriptionType === "FREE" && open) {
    //TODO make use of selected portfolio in the Portfolio contex when it gets merged.
    const PORTFOLIO_ENTRY_LIMIT = 3;
    const portfolioEntries = selectedPortfolio.portfolioEntries.length;

    if (portfolioEntries === PORTFOLIO_ENTRY_LIMIT) {
      toast.error(
        `Portfolio limit of ${PORTFOLIO_ENTRY_LIMIT} reached for free users. Upgrade to premium for unlimited entries.`
      );
        setOpen(false);
      return;
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      const portfolioEntryRequest = {
        ticker: stock.ticker,
        stockPrice: addStockData.stockPrice,
        quantity: addStockData.quantity,
        portfolioId: selectedPortfolio.id,
      };

      const isAdded = addStockToPortfolio(portfolioEntryRequest);
      if (isAdded) {
        toast("Stock was added to the portfolio successfully");
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast(error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="hover:bg-accent rounded-md cursor-pointer">Add</div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Stock</DialogTitle>
            <DialogDescription>
              Add a stock to your portfolio.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="">
                portfolio
              </Label>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a portfolio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {portfolios.map((portfolio) => (
                      <SelectItem
                        key={portfolio.id}
                        value={portfolio.id.toString()}
                      >
                        {portfolio.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock">stock</Label>
              {/*  */}
              <Input
                id="stock"
                className="w-[180px]"
                value={stock.name}
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price">price</Label>
              <Input
                id="price"
                className="w-[180px]"
                onChange={(e) =>
                  setAddStockData({
                    ...addStockData,
                    stockPrice: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity">quantity</Label>
              <Input
                id="quantity"
                className="w-[180px]"
                onChange={(e) =>
                  setAddStockData({
                    ...addStockData,
                    quantity: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add</Button>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
