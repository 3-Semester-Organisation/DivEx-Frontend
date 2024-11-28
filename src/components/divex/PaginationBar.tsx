// import React = require("react");

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

export default function PaginationBar({ currecntPage, totalPages, setCurrentPage }) {

    let startPage = Math.max(0, currecntPage - 1);
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
                            {currecntPage > 0 && (
                                <PaginationFirst
                                    onClick={() => setCurrentPage(0)}
                                >
                                    First
                                </PaginationFirst>
                            )}
                        </PaginationItem>

                        <PaginationItem>
                            {currecntPage > 0 && (
                                <PaginationPrevious
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
                                    className={currecntPage === pageNumber ? "bg-slate-800" : ""}
                                >
                                    {pageNumber + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}


                        {totalPages > 5 && currecntPage < totalPages - 5 ? (
                            <PaginationItem>
                                <PaginationEllipsis
                                    className="mt-2" />
                            </PaginationItem>
                        ) : null}



                        <PaginationItem>
                            {currecntPage !== totalPages - 1 && (
                                <PaginationNext
                                    onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages - 1))}
                                >
                                    Next
                                </PaginationNext>
                            )}
                        </PaginationItem>

                        <PaginationItem>
                            {currecntPage !== totalPages - 1 && (
                                <PaginationLast
                                    onClick={() => setCurrentPage(totalPages - 1)}
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