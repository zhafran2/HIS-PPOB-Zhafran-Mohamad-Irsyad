import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "../helpers/axiosInstance";
import profile from "../assets/Profile Photo.png";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  
  function handleLogin(e) {
    e.preventDefault()
    localStorage.removeItem('token')
    navigate('/login')
  }
  async function fetchProfile() {
    setLoading(true);
    try {
      const { data } = await axios({
        method: "GET",
        url: "/profile",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto text-center mt-10">
      {loading && <p className="text-gray-500">Loading...</p>}
      {errors && <p className="text-red-500">{errors}</p>}
      {user && (
        <>
          {/* Foto Profil */}
          <div className="relative">
            <img
              src={profile || user.profile_image}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <button className="absolute bottom-2 right-10 bg-white border rounded-full p-1 shadow-md">
              ✏️
            </button>
          </div>

          {/* Nama */}
          <h2 className="text-2xl font-bold text-gray-900">{user.first_name} {user.last_name}</h2>

          {/* Form Profil */}
          <div className="mt-4 text-left">
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="text"
              value={user.email}
              disabled
              className="border rounded-lg px-3 py-2 w-full bg-gray-100"
            />

            <label className="text-sm text-gray-600 mt-3">Nama Depan</label>
            <input
              type="text"
              value={user.first_name}
              className="border rounded-lg px-3 py-2 w-full"
            />

            <label className="text-sm text-gray-600 mt-3">Nama Belakang</label>
            <input
              type="text"
              value={user.last_name}
              className="border rounded-lg px-3 py-2 w-full"
            />
          </div>

          {/* Tombol Edit & Logout */}
          <button className=" text-red-600 py-2 px-4 rounded-lg mt-4 w-full border border-red-700 hover:text-2xl">
           <Link to={'/profile/update'}> Edit Profile</Link>
          </button>

          <button className="bg-red-600 text-white py-2 px-4 rounded-lg mt-2 w-full hover:text-2xl" onClick={handleLogin}>
            Logout
          </button>
        </>
      )}
    </div>
  );
}
