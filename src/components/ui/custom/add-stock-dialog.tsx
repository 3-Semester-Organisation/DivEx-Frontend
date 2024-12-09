import React, { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PortfoliosContext, usePortfolios } from "@/js/PortfoliosContext";
import { AuthContext } from "@/js/AuthContext";
import { addStockToPortfolio } from "@/api/portfolio";

const formSchema = z.object({
    portfolio: z.string().nonempty({ message: "Please select a portfolio." }),
    
    price: z
      .string()
      .regex(/^\d+(\.\d+)?$/, { message: "Price must be a valid number." })
      .transform((value) => parseFloat(value)),
    
    quantity: z
      .string()
      .regex(/^\d+$/, { message: "Quantity must be a valid integer." })
      .transform((value) => parseInt(value, 10)),
  });

export function AddStockDialog({ stock }) {
  const [open, setOpen] = useState(false);
  const { portfolios } = usePortfolios();
  const { selectedPortfolio } = useContext(PortfoliosContext);
  const { subscriptionType } = useContext(AuthContext);

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      portfolio: selectedPortfolio ? selectedPortfolio.id.toString() : "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const portfolioEntryRequest = {
        ticker: stock.ticker,
        stockPrice: values.price,
        quantity: values.quantity,
        portfolioId: values.portfolio,
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
              <Button>
                  Add (new)
              </Button>
              {/*<div className="hover:bg-accent rounded-md cursor-pointer">Add</div>*/}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <DialogHeader>
              <DialogTitle>Add Stock</DialogTitle>
              <DialogDescription>
                Fill in the details below to add the stock to your portfolio.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              {/* Portfolio Select Field */}
              <FormField
                control={form.control}
                name="portfolio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portfolio</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a portfolio" />
                        </SelectTrigger>
                        <SelectContent>
                          {portfolios &&
                            portfolios.map((portfolio) => (
                              <SelectItem
                                key={portfolio.id}
                                value={portfolio.id.toString()}
                              >
                                {portfolio.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Stock Name (Disabled Input) */}
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input value={stock.name} disabled />
                </FormControl>
              </FormItem>

              {/* Price Input Field */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                            <Input
                                type="number"
                                inputMode="decimal"
                        placeholder="Enter price"
                        {...field}
                        className="bg-primary-foreground border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Quantity Input Field */}
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                                placeholder="Enter quantity"
                                type="number"
                                inputMode="numeric"
                        {...field}
                        className="bg-primary-foreground border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
        </Form>
      </DialogContent>
    </Dialog>
  );
}