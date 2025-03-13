import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "../helpers/axiosInstance";
import profile from "../assets/Profile Photo.png";


import pgn from "../assets/PGN.png";
import game from "../assets/Game.png";
import kurban from "../assets/Kurban.png";
import listrik from "../assets/Listrik.png";
import musik from "../assets/Musik.png";
import paketData from "../assets/Paket Data.png";
import pbb from "../assets/PBB.png";
import pdam from "../assets/PDAM.png";
import pulsa from "../assets/Pulsa.png";
import tv from "../assets/Televisi.png";
import voucherMakanan from "../assets/Voucher Makanan.png";
import zakat from "../assets/Zakat.png";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchProfile() {
    setLoading(true);
    try {
      const { data } = await axios({
        method: "GET",
        url: "/profile",
        headers: {
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
      });
      localStorage.setItem("first_name", data.data.first_name);
      localStorage.setItem("last_name", data.data.last_name);
      setUser(data.data);
    } catch (error) {
      setErrors(error.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          {loading && <p className="text-gray-500">Loading...</p>}
          {errors && <p className="text-red-500">{errors}</p>}
          {user && (
            <>
              <img
                src={profile}
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h2 className="text-xl font-bold text-gray-800">
                Selamat datang,
              </h2>
              <h3 className="text-2xl font-bold text-gray-900">{user.first_name} {user.last_name}</h3>
            </>
          )}
        </div>
        
        {/* Services Section */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[pbb, listrik, pulsa, pdam, pgn, tv, musik, game, voucherMakanan, kurban, zakat, paketData].map((icon, index) => (
            <div key={index} className="flex flex-col items-center bg-white p-4 rounded-lg shadow">
              <img src={icon} alt="service" className="w-12 h-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
