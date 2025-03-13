import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "../helpers/axiosInstance";
import profile from "../assets/Profile Photo.png";

export default function UserProfile() {
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
    <>
       <div className="bg-white shadow-lg rounded-b-field p-4 max-w-sm text-center">
      {loading && <p className="text-gray-500">Loading...</p>}
      {errors && <p className="text-red-500">{errors}</p>}
      {user && (
        <>
          <img
            src={profile || user.profile_image}
            alt="Profile"
            className="w-20 h-20 rounded-full mx-auto mb-2"
          />
          <h2 className="text-lg font-semibold text-gray-800">
            Selamat datang,
          </h2>
          <h2 className="text-3xl font-bold text-gray-900">
            {user.first_name} {user.last_name}
          </h2>
        </>
      )}
    </div>
    </>
  );
}
