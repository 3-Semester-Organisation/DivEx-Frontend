
import React from 'react';
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
} from "@/components/ui/pagination";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const MAX_VISIBLE_PAGES = 5;

const PaginationBar: React.FC<PaginationBarProps> = ({ currentPage, totalPages, setCurrentPage }) => {
  // Early return if no pagination is needed
  if (totalPages <= 1) return null;

  const half = Math.floor(MAX_VISIBLE_PAGES / 2);

  // Initialize start and end pages
  let startPage = currentPage - half;
  let endPage = currentPage + half;


  if (startPage < 0) {
    endPage += Math.abs(startPage);
    startPage = 0;
  }

  // Adjust if endPage exceeds totalPages
  if (endPage >= totalPages) {
    endPage = totalPages - 1;
    startPage = Math.max(endPage - MAX_VISIBLE_PAGES + 1, 0);
  }

  const paginationButtons: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    paginationButtons.push(i);
  }

  return (
    <div className="w-40 mx-auto mt-5">
      <Pagination>
        <PaginationContent>

          {/* First Page Button */}
          <PaginationItem>
            {currentPage > 0 && (
              <PaginationFirst
                className="cursor-pointer"
                onClick={() => setCurrentPage(0)}
                aria-label="First Page"
              >
                First
              </PaginationFirst>
            )}
          </PaginationItem>

          {/* Previous Page Button */}
          <PaginationItem>
            {currentPage > 0 && (
              <PaginationPrevious
                className="cursor-pointer"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                aria-label="Previous Page"
              >
                Previous
              </PaginationPrevious>
            )}
          </PaginationItem>

          {/* Ellipsis Before Page Buttons */}
          {startPage > 0 && (
            <>
              <PaginationItem>
                <PaginationLink
                  onClick={() => setCurrentPage(0)}
                  className="px-2 cursor-pointer"
                  aria-label="Page 1"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {startPage > 1 && (
                <PaginationItem>
                  <PaginationEllipsis>&hellip;</PaginationEllipsis>
                </PaginationItem>
              )}
            </>
          )}

          {/* Page Number Buttons */}
          {paginationButtons.map(pageNumber => (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                onClick={() => setCurrentPage(pageNumber)}
                className={
                  currentPage === pageNumber
                    ? "dark:bg-slate-800 dark:text-white cursor-pointer bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                    : "cursor-pointer"
                }
                aria-current={currentPage === pageNumber ? "page" : undefined}
                aria-label={`Page ${pageNumber + 1}`}
              >
                {pageNumber + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Ellipsis After Page Buttons */}
          {endPage < totalPages - 1 && (
            <>
              {endPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis>&hellip;</PaginationEllipsis>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  onClick={() => setCurrentPage(totalPages - 1)}
                  className="cursor-pointer"
                  aria-label={`Page ${totalPages}`}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          {/* Next Page Button */}
          <PaginationItem>
            {currentPage < totalPages - 1 && (
              <PaginationNext
                className="cursor-pointer"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                aria-label="Next Page"
              >
                Next
              </PaginationNext>
            )}
          </PaginationItem>

          {/* Last Page Button */}
          <PaginationItem>
            {currentPage < totalPages - 1 && (
              <PaginationLast
                className="cursor-pointer"
                onClick={() => setCurrentPage(totalPages - 1)}
                aria-label="Last Page"
              >
                Last
              </PaginationLast>
            )}
          </PaginationItem>

        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationBar;