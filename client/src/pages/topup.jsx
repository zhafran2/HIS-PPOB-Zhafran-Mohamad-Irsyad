import { useState } from "react";
import Saldo from "../components/saldo";
import UserProfile from "../components/UserProfile";
import axios from "../helpers/axiosInstance";
import { useNavigate } from "react-router";

export default function TopUp() {
  const [processing, setIsProcessing] = useState(false);
  const [top_up_amount, setTop_Up_Amount] = useState(0);
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();

  const predefinedAmounts = [10000, 20000, 50000, 100000, 250000, 500000];

  async function handleTopUp(e) {
    e.preventDefault();
    try {
      setIsProcessing(true);
      const { data } = await axios({
        method: "POST",
        url: "/topup",
        data: { top_up_amount },
        headers: {
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
      });
      if (data.status === 0) {
        navigate("/");
      }
    } catch (error) {
      setErrors(error.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 pt-4">
      <div className="flex flex-col md:flex-row items-start gap-4">
        <div className="w-full md:w-[35%]">
          <UserProfile />
          <p>Silahkan masukkan</p>
          <p className="text-2xl font-bold">Nominal Top Up</p>
          <input
            type="number"
            placeholder="Masukkan nominal top up"
            value={top_up_amount}
            onChange={(e) => setTop_Up_Amount(Number(e.target.value))}
            className="w-full p-3 border rounded-md mb-4"
          />
          <div className="grid grid-cols-3 gap-2 mb-4">
            {predefinedAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setTop_Up_Amount(amount)}
                className="p-2 border rounded-md hover:bg-gray-200"
              >
                Rp{amount.toLocaleString("id-ID")}
              </button>
            ))}
          </div>
          {errors && <p className="text-red-500 mb-4">{errors}</p>}
          <button
            onClick={handleTopUp}
            disabled={processing || top_up_amount < 10000 || top_up_amount > 1000000}
            className={`w-full py-3 text-white rounded-md text-lg font-bold ${
              processing || top_up_amount < 10000 || top_up_amount > 1000000
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {processing ? "Memproses..." : "Top Up"}
          </button>
        </div>
        <div className="w-full md:w-[65%]">
          <Saldo />
        </div>
      </div>
    </div>
  );
}
