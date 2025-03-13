import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "../helpers/axiosInstance";
import profile from "../assets/Profile Photo.png";

import Services from "../components/services";
import Banners from "../components/banners";
import Saldo from "../components/saldo";

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
      console.log(data,"AAAA");
      
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
    <div className="min-h-screen bg-gray-100 px-6 pt-4">
      {/* Header */}
      <div className="bg-white shadow-lg rounded-lg p-6 text-center">
        {loading && <p className="text-gray-500">Loading...</p>}
        {errors && <p className="text-red-500">{errors}</p>}
        {user && (
          <>
            <img
              src={profile||user.profile_image}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto mb-2"
            />
            <h2 className="text-xl font-semibold text-gray-800">
              Selamat datang,
            </h2>
            <h3 className="text-2xl font-bold text-gray-900">
              {user.first_name} {user.last_name}
            </h3>
          </>
        )}
      </div>

      {/* Saldo Section */}
      <Saldo/>

      {/* Services Section */}
      <Services />

      {/* Promo Section */}
      <Banners />
    </div>
  );
}
