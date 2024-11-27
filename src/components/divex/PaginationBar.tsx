// import React = require("react");
import "./PaginationBar.css";


export default function PaginationBar({ currecntPage, totalPages, setCurrentPage }) {

    let startPage = Math.max(0, currecntPage - 1);
    const endPage = Math.min(startPage + 5, totalPages);

    let paginationButtons: number[] = [];

    for (let i: number = startPage; i < endPage; i++) {
        paginationButtons.push(i);
    }

    return (
        <>
            <div className="pagination-bar">
                <button
                    onClick={() => setCurrentPage(page => Math.max(page - 1, 0))}
                    hidden={currecntPage === 0}
                    className="pagination-button"
                >
                    Previous
                </button>

                {paginationButtons.map(pageNumber => (
                    <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`pagination-button ${pageNumber === currecntPage ? "active" : ""}`}
                    >
                        {pageNumber + 1}
                    </button>
                ))}

                <button
                    onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages - 1))}
                    hidden={currecntPage === totalPages - 1}
                    className="pagination-button"
                >
                    Next
                </button>
            </div>
        </>

    )
}