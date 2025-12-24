"use client"


import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/app/(pages)/components/SearchBar";
import { useEffect, useState } from "react";
import { paramsBuilder } from "@/utils/params";
import PaginationComponent from "@/components/common/Pagination";
import { formatDate } from "@/utils/date";

export default function InvoiceShowcase() {
    const [keyword, setKeyword] = useState("");
    const [submitKeyword, setSubmitKeyword] = useState("");
    const [loading, setLoading] = useState(true);
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setInvoices([]);
            const url = paramsBuilder(`${process.env.NEXT_PUBLIC_API_URL}/invoice`, {
                search: submitKeyword,
                page: currentPage,
                pageSize: 10,
            });
            await fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    if (data.code == "success") {
                        setInvoices(data.invoices);
                        setTotalPages(data.totalPages);
                    }
                })
            setLoading(false);
        }

        fetchData();
    }, [submitKeyword, currentPage]);

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    
                    {/* Header Section */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Invoice Management</h1>
                        <p className="text-gray-600">View and search all your invoices</p>
                    </div>

                    {/* Search Section */}
                    <div className="mb-8">
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                            <p className="text-sm text-gray-600 mb-4 font-medium">Enter your phone number to search invoices</p>
                            <SearchBar 
                                keyword={keyword} 
                                setKeyword={setKeyword} 
                                setSubmitKeyword={setSubmitKeyword}
                            />
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Search Results</h2>
                            {invoices.length > 0 && (
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {invoices.length} invoices
                                </span>
                            )}
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="bg-white rounded-lg shadow-sm p-12 flex justify-center items-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                                    <p className="text-gray-600">Loading invoices...</p>
                                </div>
                            </div>
                        )}

                        {/* Table Section */}
                        {!loading && invoices.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                                <th className="px-6 py-4 text-left font-semibold text-gray-900">Invoice ID</th>
                                                <th className="px-6 py-4 text-left font-semibold text-gray-900">Customer</th>
                                                <th className="px-6 py-4 text-left font-semibold text-gray-900">Phone</th>
                                                <th className="px-6 py-4 text-left font-semibold text-gray-900">Total Amount</th>
                                                <th className="px-6 py-4 text-left font-semibold text-gray-900">Payment Method</th>
                                                <th className="px-6 py-4 text-left font-semibold text-gray-900">Status</th>
                                                <th className="px-6 py-4 text-left font-semibold text-gray-900">Created At</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoices.map((item, index) => (
                                                <tr 
                                                    key={item.invoice_id} 
                                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                                >
                                                    <td className="px-6 py-4 font-mono text-xs text-gray-700 bg-gray-50 rounded-l">
                                                        {item.invoice_id.slice(0, 8)}...
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-gray-900">
                                                        {item.customer_name}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-700">
                                                        {item.phone_number}
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-gray-900">
                                                        {Number(item.total_price).toLocaleString()} ₫
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {item.payment_method ? (
                                                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                                                                {item.payment_method}
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="text-gray-500">N/A</Badge>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {item.status === "Completed" ? (
                                                            <Badge className="bg-green-600 hover:bg-green-700">Completed</Badge>
                                                        ) : (
                                                            <Badge variant="destructive" className="bg-yellow-600 hover:bg-yellow-700">Pending</Badge>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-700">
                                                        {item.created_at ? formatDate(item.created_at) : "--"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && invoices.length === 0 && (
                            <div className="bg-white rounded-lg shadow-sm p-12 flex justify-center items-center border border-gray-200 border-dashed">
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <p className="text-gray-600 font-medium">No invoices found</p>
                                    <p className="text-sm text-gray-500">Please try again with a different keyword</p>
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && invoices.length > 0 && (
                            <div className="mt-8 flex justify-center">
                                <PaginationComponent
                                    numberOfPages={totalPages}
                                    currentPage={currentPage}
                                    controlPage={setCurrentPage}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}