import * as React from 'react';

import { checkHttpsErrors } from '@/js/util';

interface Stock { 
    ticker: string;
    name: string;
    country: string;
    exchange: string;
    currency: string;
    industry: string;
    sector: string;
}

interface PaginatedResponse<T> { 
    content: T[];
    totalPages: number;
}

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

export { fetchPaginatedStocks }