import { useEffect, useState } from "react";
import axios from "../helpers/axiosInstance";
import { useNavigate } from "react-router";
import photo from '../assets/Profile Photo.png'
export default function UpdateProfile() {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [profile_image, setProfileImage] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
    const navigate =useNavigate()
  // Fetch profile saat pertama kali render
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
      setFirstName(data.data.first_name);
      setLastName(data.data.last_name);
      setEmail(data.data.email);
      setProfileImage(data.data.profile_image);
    } catch (error) {
      setError(error.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  // Update nama depan dan belakang
  async function updateUser(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios({
        method: "PUT",
        url: "/profile/update",
        data: { first_name, last_name },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
     navigate('/profile')
    } catch (error) {
      setError(error.response?.data?.message || "Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  }

  // Update foto profil
  async function updateUserImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_image", file);

    setLoading(true);
    try {
      const { data } = await axios({
        method: "PUT",
        url: "/profile/image",
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setProfileImage(data.data.profile_image);
      navigate('/profile')
    } catch (error) {
      setError(error.response?.data?.message || "Gagal memperbarui foto");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="max-w-lg mx-auto mt-10 text-center">
      {error && <p className="text-red-500">{error}</p>}

      {/* Foto Profil */}
      <div className="relative w-24 h-24 mx-auto">
        <img
          src={photo}
          alt="Profile"
          className="w-24 h-24 rounded-full border"
        />
        <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md cursor-pointer">
          ✏️
          <input type="file" className="hidden" onChange={updateUserImage} />
        </label>
      </div>

      {/* Nama Lengkap */}
      <h2 className="text-2xl font-bold mt-3">
        {first_name} {last_name}
      </h2>

      {/* Form */}
      <form className="mt-5 text-left" onSubmit={updateUser}>
        <label className="block text-sm text-gray-600">Email</label>
        <input
          type="text"
          value={email}
          disabled
          className="border rounded-lg px-3 py-2 w-full bg-gray-100"
        />

        <label className="block text-sm text-gray-600 mt-3">Nama Depan</label>
        <input
          type="text"
          value={first_name}
          onChange={(e) => setFirstName(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full"
        />

        <label className="block text-sm text-gray-600 mt-3">Nama Belakang</label>
        <input
          type="text"
          value={last_name}
          onChange={(e) => setLastName(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full"
        />

        <button
          type="submit"
          className="bg-red-500 text-white py-2 px-4 rounded-lg mt-4 w-full"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}
