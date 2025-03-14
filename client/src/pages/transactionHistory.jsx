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
          Authorization: `Bearer ${localStorage.getItem(token)}`,
        },
      });
      setHistory(data.data);
    } catch (error) {
      setError(error.response.data.message);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);
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

      <div>
        
      </div>
    </>
  );
}
