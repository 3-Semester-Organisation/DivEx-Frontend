import { checkHttpsErrors } from '@/js/util';
import { PaginatedResponse, Stock } from '@/divextypes/types';

async function fetchPaginatedStocks(pageNumber: number, pageSize: number = 10, sorting: { column: string, direction: string }) {
    try {
        const response = await fetch(
            `http://localhost:8080/api/v1/stocks?page=${pageNumber}&size=${pageSize}&sort=${sorting.column},${sorting.direction}`
        );
        checkHttpsErrors(response);

        const fetchedPage: PaginatedResponse<Stock> = await response.json();
        return {
            content: fetchedPage.content,
            totalPages: fetchedPage.totalPages

        };
    } catch (error) {
        console.log(error);
    } 
}

async function fetchStocksBySearchTerm(searchTerm: string) {
    try {
        const response = await fetch("http://localhost:8080/api/v1/stocks/" + searchTerm);
        checkHttpsErrors(response);

        const searchResult: Stock[] = await response.json();
        return searchResult;

    } catch (error) {
        console.log(error);
    } 
}

async function fetchStocksForCalendar(date: number, currentPage: number, sorting: { column: string, direction: string }) {
    const PAGESIZE = 10;
    let url: string;
    if (date !== undefined) {
        url = `http://localhost:8080/api/v1/stocksByDate?date=${date}&page=${currentPage}&size=${PAGESIZE}&sort=${sorting.column},${sorting.direction}`;
    } else {
        url = `http://localhost:8080/api/v1/stocks?page=${currentPage}&size=${PAGESIZE}&sort=${sorting.column},${sorting.direction}`;
    }

    try {
        const response = await fetch(url);
        checkHttpsErrors(response);

        const fetchedPage: PaginatedResponse<Stock> = await response.json();
        return {
            content: fetchedPage.content,
            totalPages: fetchedPage.totalPages
        };
    } catch (error) {
        console.log(error);
    }
}

async function fetchStocksByDividendDate(date: number, currentPage: number, sorting: { column: string, direction: string }) {
    const PAGESIZE = 10;
    const url = `http://localhost:8080/api/v1/stocksByDate?date=${date}&page=${currentPage}&size=${PAGESIZE}&sort=${sorting.column},${sorting.direction}`;

    try {
        const response = await fetch(url);
        checkHttpsErrors(response);

        const fetchedPage: PaginatedResponse<Stock> = await response.json();
        return {
            content: fetchedPage.content,
            totalPages: fetchedPage.totalPages
        };
    } catch (error) {
        console.log(error);
    }
}

async function fetchDividendDates() {
    const url = "http://localhost:8080/api/v1/stocks/dividendDates";
    try {
        const response = await fetch(url);
        checkHttpsErrors(response);

        const dates = await response.json();
        return dates.map((date) => date.exDividendDate);
    } catch (error) {
        console.log(error);
    }
}

export {
    fetchPaginatedStocks,
    fetchStocksBySearchTerm,
    fetchStocksForCalendar,
    fetchStocksByDividendDate,
    fetchDividendDates
}