import { useState } from "react";
import Saldo from "../components/Saldo";
import UserProfile from "../components/UserProfile";
import axios from "../helpers/axiosInstance";
import { useNavigate } from "react-router";

export default function TopUp() {
  const [processing, setIsProcessing] = useState(false);
  const [top_up_amount, setTop_Up_Amount] = useState(0);
  const [errors, setErrors] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // State untuk pesan sukses
  const navigate = useNavigate();

  const predefinedAmounts = [10000, 20000, 50000, 100000, 250000, 500000];

  async function handleTopUp(e) {
    e.preventDefault();
    setErrors("");
    setSuccessMessage(""); // Reset pesan sebelum request

    try {
      setIsProcessing(true);
      const { data } = await axios({
        method: "POST",
        url: "/topup",
        data: {
          top_up_amount,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (data.status === 0) {
        setSuccessMessage(data.message); // Set pesan sukses dari response
      }
    } catch (error) {
      setErrors(error.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="ml-8 mr-8 mt-8">
      {/* Header: User Profile & Saldo */}
      <div className="flex items-start justify-between">
        <div className="w-2/5 ">
          <UserProfile />
        </div>
        <div className="w-3/5 ">
          <Saldo />
        </div>
      </div>

      {/* Form Top Up */}
      <div className="mt-6 grid grid-cols-3 gap-6">
        {/* Input & Button */}
        <div className="col-span-2">
          <p className="text-xl">Silahkan masukkan</p>
          <h3 className="text-2xl font-bold mb-4">Nominal Top Up</h3>

          {/* Input Nominal */}
          <input
            type="number"
            value={top_up_amount}
            onChange={(e) => setTop_Up_Amount(Number(e.target.value))}
            placeholder="Masukkan nominal Top Up"
            className="w-full p-3 border rounded-md mb-4"
          />

          {/* Tombol Top Up */}
          <button
            onClick={handleTopUp}
            disabled={
              processing || top_up_amount < 10000 || top_up_amount > 1000000
            }
            className={`w-full py-3 text-white rounded-md text-lg font-bold ${
              processing || top_up_amount < 10000 || top_up_amount > 1000000
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {processing ? "Memproses..." : "Top Up"}
          </button>

          {/* Pesan Sukses */}
          {successMessage && (
            <p className="text-green-500 text-sm mt-2">{successMessage}</p>
          )}

          {/* Pesan Error */}
          {errors && <p className="text-red-500 text-sm mt-2">{errors}</p>}
        </div>

        {/* Opsi Nominal */}
        <div className="grid grid-cols-3 gap-3 h-3 mt-19">
          {predefinedAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => setTop_Up_Amount(amount)}
              className="p-3 border border-gray-400 rounded-md hover:bg-gray-200 text-center"
            >
              Rp{amount.toLocaleString("id-ID")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
