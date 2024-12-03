import * as React from 'react'

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationLast,
    PaginationPrevious,
    PaginationFirst
} from "@/components/ui/pagination"

export default function PaginationBar({ currentPage, totalPages, setCurrentPage }) {

    let startPage = Math.max(0, currentPage - 1);
    const endPage = Math.min(startPage + 5, totalPages);

    let paginationButtons: number[] = [];

    for (let i: number = startPage; i < endPage; i++) {
        paginationButtons.push(i);
    }

    return (
        <>
            <div className="w-40 mx-auto mt-5">
                <Pagination>
                    <PaginationContent>

                        <PaginationItem>
                            {currentPage > 0 && (
                                <PaginationFirst
                                    className="cursor-pointer"
                                    onClick={() => setCurrentPage(0)}
                                >
                                    First
                                </PaginationFirst>
                            )}
                        </PaginationItem>

                        <PaginationItem>
                            {currentPage > 0 && (
                                <PaginationPrevious
                                    className="cursor-pointer"
                                    onClick={() => setCurrentPage(page => Math.max(page - 1, 0))}
                                >
                                    Previous
                                </PaginationPrevious>
                            )}
                        </PaginationItem>


                        {paginationButtons.map(pageNumber => (
                            < PaginationItem >
                                <PaginationLink
                                    key={pageNumber}
                                    onClick={() => setCurrentPage(pageNumber)}
                                    className={currentPage === pageNumber ? "border cursor-pointer" : "cursor-pointer" }
                                >
                                    {pageNumber + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}


                        {totalPages > 5 && currentPage < totalPages - 5 ? (
                            <PaginationItem>
                                <PaginationEllipsis
                                    className="mt-2" />
                            </PaginationItem>
                        ) : null}



                        <PaginationItem>
                            {currentPage !== totalPages - 1 && (
                                <PaginationNext
                                    onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages - 1))}
                                    className="cursor-pointer"
                                >
                                    Next
                                </PaginationNext>
                            )}
                        </PaginationItem>

                        <PaginationItem>
                            {currentPage !== totalPages - 1 && (
                                <PaginationLast
                                    onClick={() => setCurrentPage(totalPages - 1)}
                                    className="cursor-pointer"
                                >
                                    
                                    Last
                                </PaginationLast>
                            )}
                        </PaginationItem>
                    </PaginationContent>
                </Pagination >
            </div>
        </>
    )
}