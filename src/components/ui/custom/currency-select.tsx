import React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// set defaultvalue to DKK
export function CurrencySelect({ selectedCurrency, setSelectedCurrency, supportedCurrencies }) {
  return (
    <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
          <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Select a currency" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
            <SelectLabel>Select currency</SelectLabel>
            {supportedCurrencies.map((currency: string) => (
              <SelectItem key={currency} value={currency}>
                {currency}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
