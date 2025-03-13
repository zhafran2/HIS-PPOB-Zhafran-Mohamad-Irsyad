import axios from "../helpers/axiosInstance.js";
import { useState } from "react";
import { useNavigate } from "react-router";
import logoRegis from "../assets/Logo.png";
import rekayasa from "../assets/Illustrasi Login.png";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await axios({
        method: "POST",
        url: "/registration",
        data: form,
      });

      if (data.status === 0) {
        setSuccessMessage(data.message); // ✅ Tampilkan pesan sukses
        setTimeout(() => navigate("/login"), 2000); // ✅ Pindah ke login setelah 2 detik
      }
    } catch (error) {
      setErrors({ form: error.response?.data?.message || "Registrasi gagal." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg flex w-[900px]">
        {/* Form Section */}
        <div className="p-8 w-1/2">
          <img src={logoRegis} alt="Logo" className="h-8 mb-4" />
          <h2 className="text-xl font-bold text-gray-800">SIMS PPOB</h2>
          <p className="text-sm text-gray-500 mb-4">
            Lengkapi data untuk membuat akun
          </p>
          {successMessage && (
            <p className="text-green-600 text-sm mb-3">{successMessage}</p> // ✅ Tampilkan pesan sukses di UI
          )}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="input input-bordered w-full h-12"
            />

            <input
              type="text"
              name="first_name"
              placeholder="Nama depan"
              value={form.first_name}
              onChange={handleChange}
              className="input input-bordered w-full h-12"
            />

            <input
              type="text"
              name="last_name"
              placeholder="Nama belakang"
              value={form.last_name}
              onChange={handleChange}
              className="input input-bordered w-full h-12"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="input input-bordered w-full h-12"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Konfirmasi Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="input input-bordered w-full h-12"
            />

            {errors.form && (
              <p className="text-red-500 text-sm">{errors.form}</p>
            )}

            <button
              type="submit"
              className="btn bg-red-600 w-full text-white mt-3 h-12"
              disabled={loading}
            >
              {loading ? "Loading..." : "Registrasi"}
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            Sudah punya akun?
            <span
              className="text-red-600 cursor-pointer font-semibold hover:underline"
              onClick={() => navigate("/login")}
            >
              {" "}
              di sini
            </span>
          </p>
        </div>

        {/* Illustration Section */}
        <div className="w-1/2 bg-gray-50 flex items-center justify-center p-6">
          <img src={rekayasa} alt="Illustrasi Register" className="w-80" />
        </div>
      </div>
    </div>
  );
}
