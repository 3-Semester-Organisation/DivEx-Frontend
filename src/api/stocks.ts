import * as React from 'react';

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

export { fetchPaginatedStocks, fetchStocksBySearchTerm }