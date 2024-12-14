"use client"
import React, { useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { usePortfolios } from "@/js/PortfoliosContext"
import { stockCurrencyConverter } from '@/js/util';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "../tooltip";


export function PortfolioGoalProgress({ currency }) {
    const [progress, setProgress] = React.useState(0)
    const { selectedPortfolio } = usePortfolios()

    function totalAnnualDividends() {
        let totalAnnualDividends = 0;
    
        if (selectedPortfolio.portfolioEntries === null) {
          return totalAnnualDividends;
        } else {
            
            selectedPortfolio.portfolioEntries.forEach(entry => {
                const dividendRate = entry.stock.dividendRate
          
                totalAnnualDividends += stockCurrencyConverter(dividendRate, entry, currency);
              })
        }
        
    
        return totalAnnualDividends;
    }
    
    const convertGoal = (goal, currency) => { 
        switch (currency) {
            case 'DKK': {
                return goal;
            }
            case 'SEK': {
                return goal * 1.55;
            }
            case 'NOK': {
                return goal * 1.57;
            }
        }
    }

    useEffect(() => {
        if (selectedPortfolio) {
          const goal = convertGoal(selectedPortfolio.goal, currency);
            const current = totalAnnualDividends();
            if (current > goal) {
                setProgress(100);
                return;
            } else if (!goal) {
                setProgress(0);
             } else {
                setProgress((current / goal) * 100);
            }
          
        }
      }, [selectedPortfolio, totalAnnualDividends, progress]);
    
    if (!selectedPortfolio) {
          console.log("No portfolio selected.")
        return <div>No portfolio selected.</div>;
      }

    return (
        <>
            <div className="flex flex-col content-center w-[25%]">
                <p className="">Portfolio Goal Progress</p>
                <div className="flex flex-row">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="w-full">
                                    <Progress value={progress} className="mt-1.5" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center" className="bg-primary-foreground text-foreground p-2 rounded-md shadow-lg">
                                <span>Current: {totalAnnualDividends().toFixed(2)} / {convertGoal(selectedPortfolio.goal, currency)} {currency}</span>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <p className="flex content-center ml-3">{progress.toFixed()}%</p>
                </div>
            </div>
        </>
  )
}
