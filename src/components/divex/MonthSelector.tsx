import * as React from 'react'

const months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function MonthSelector({selectedMonth, setSelectedMonth, filterDividendsBySelectedMonth}) {
    return(
        <>
         <div className='flex justify-center items-center'>
                    {months.map((month, index) =>
                        <button
                            onClick={() => {
                                setSelectedMonth(index);
                                filterDividendsBySelectedMonth(index);
                            }}
                            className={selectedMonth === index
                                ? 'ml-3 mb-3 px-1 py-1 border-2 border-gray-400 rounded-lg hover:underline font-bold'
                                : 'ml-3 mb-3 px-1 py-1 border-2 border-gray-400 rounded-lg hover:underline opacity-65'}
                        >
                            {month}
                        </button>
                    )}
                </div>
        </>
    )
}