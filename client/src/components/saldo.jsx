import { useState } from "react";
import { useNavigate } from "react-router";

export default function Saldo() {
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      {loading && <p className="text-gray-500">Loading...</p>}
      {errors && <p className="text-red-500">{errors}</p>}
      <div className="bg-red-500 text-white px-6 py-4 rounded-lg text-start relative mt-4 md:mt-0 h-60">
        <p className="text-lg font-semibold">Saldo Anda</p>
        <p className="text-3xl font-bold">Rp ••••••••</p>
        <button
          className="absolute bottom-4 left-6 text-sm underline hover:border-l-base-100"
          onClick={() => navigate("/topup")}
        >
          Lihat Saldo
        </button>
      </div>
    </>
  );
}
