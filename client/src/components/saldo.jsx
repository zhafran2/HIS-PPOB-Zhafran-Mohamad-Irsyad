import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import axios from "../helpers/axiosInstance";

export default function Saldo() {
  const [balance, setBalance] = useState(null);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(false); // ✅ State untuk toggle saldo
  const navigate = useNavigate();
  const location = useLocation();

  async function balanceUser() {
    setLoading(true);
    try {
      const { data } = await axios({
        method: "GET",
        url: "/balance",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (data.status === 0) {
        setBalance(data.data.balance);
        localStorage.setItem("saldo", data.data.balance);
      }
    } catch (error) {
      setErrors(error.response?.data?.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    balanceUser();
  }, []);

  return (
    <>
      {loading && <p className="text-gray-500">Loading...</p>}
      {errors && <p className="text-red-500">{errors}</p>}
      <div className="bg-red-500 text-white px-6 py-4 rounded-lg text-start relative mt-4 md:mt-0 h-60">
        <p className="text-lg font-semibold">Saldo Anda</p>
        <p className="text-3xl font-bold">
          {showBalance || location.pathname !== "/" 
            ? `Rp ${balance?.toLocaleString()}` 
            : "Rp ••••••••"}
        </p>
        <button
          className="absolute bottom-4 left-6 text-sm underline hover:border-l-base-100"
          onClick={() => setShowBalance(!showBalance)} // ✅ Toggle saldo saat tombol diklik
        >
          {showBalance ? "Sembunyikan Saldo" : "Lihat Saldo"} {/* ✅ Ubah teks tombol sesuai status */}
        </button>
      </div>
    </>
  );
}
