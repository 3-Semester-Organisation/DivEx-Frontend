interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
}

interface HistoricalPricing {
    openingPrice: number;
    openingDate: number;
    previousDailyClosingPrice: number;
    closingDate: number;
}

interface HistoricalDividend {
    dividendRate: number;
    exDividendDate: number
}

interface Stock {
    ticker: string;
    name: string;
    country: string;
    exchange: string;
    currency: string;
    industry: string;
    sector: string;

    historicalPricing: HistoricalPricing[];

    dividendRate: number;
    dividendYield: number;
    dividendRatio: number;
    exDividendDate: number;

    historicalDividends: HistoricalDividend[];
}

interface PortfolioEntryRequest {
    ticker: string;
    stockPrice: number;
    quantity: number;
    portfolioId: number;
}

interface PortfolioEntry {
    stock: Stock;
    stockPrice: number;
    quantity: number;
    entryDate: number;
}

interface Portfolio {
    id: number;
    name: string;
    portfolioEntries: PortfolioEntry[]
    user: User;
}

interface PaginatedResponse<T> {
    content: T[];
    totalPages: number;
}

export { User, HistoricalPricing, HistoricalDividend, Stock, Portfolio, PortfolioEntry, PaginatedResponse, PortfolioEntryRequest }