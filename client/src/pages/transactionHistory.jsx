import { useEffect, useState } from "react";
import axios from "../helpers/axiosInstance";
import Saldo from "../components/Saldo";
import UserProfile from "../components/UserProfile";

export default function TransactionHistory() {
  const [history, setHistory] = useState([]);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const limit = 3; // Sesuai dengan data backend

  async function fetchTransactions(newOffset = 0, append = false) {
    try {
      setLoading(true);
      const { data } = await axios({
        method: "GET",
        url: `/transaction/history?offset=${newOffset}&limit=${limit}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setHistory((prev) =>
        append ? [...prev, ...data.data.records] : data.data.records
      );
      setOffset(newOffset);
    } catch (error) {
      setError(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  const loadMore = () => {
    fetchTransactions(offset + limit, true);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  return (
    <>
      <div className="ml-8 mr-8 mt-8">
        <div className="flex items-start justify-between">
          <div className="w-2/5">
            <UserProfile />
          </div>
          <div className="w-3/5">
            <Saldo />
          </div>
        </div>
      </div>

      <div className="ml-8 mr-8 mt-8">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>

        {error && (
          <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {history.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((transaction, index) => (
                  <tr key={transaction.invoice_number || index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.invoice_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.transaction_type === "TOPUP"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-red-800"
                        }`}
                      >
                        {transaction.transaction_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.transaction_type === "TOPUP" ? "+" : "-"}
                      {formatCurrency(transaction.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(transaction.created_on)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded">
            {error
              ? "Failed to load transactions"
              : "No transaction history found"}
          </div>
        )}

        <div className="text-center mt-4">
          <button
            onClick={loadMore}
            disabled={loading}
            className="text-red-500 hover:underline"
          >
            {loading ? "Loading..." : "Show more"}
          </button>
        </div>
      </div>
    </>
  );
}
