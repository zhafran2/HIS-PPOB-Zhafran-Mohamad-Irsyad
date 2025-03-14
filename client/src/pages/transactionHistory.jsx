import { useEffect, useState } from "react";
import axios from "../helpers/axiosInstance";
import Saldo from "../components/Saldo";
import UserProfile from "../components/UserProfile";

export default function TransactionHistory() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  async function fetchTransactions() {
    try {
      const { data } = await axios({
        method: "GET",
        url: "/transaction/history",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setHistory(data.data.records || []);
    } catch (error) {
      setError(error.response?.data?.message);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Format the date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // Format currency
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
                            : "bg-blue-100 text-blue-800"
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
      </div>
    </>
  );
}
