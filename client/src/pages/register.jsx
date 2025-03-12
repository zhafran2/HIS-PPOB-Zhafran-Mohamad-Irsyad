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

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Hapus error saat user mulai mengetik
  }

  async function handleSubmit(e) {
    e.preventDefault();

    let newErrors = {};

    if (!form.email) newErrors.email = "Email wajib diisi!";
    if (!form.first_name) newErrors.first_name = "Nama depan wajib diisi!";
    if (!form.last_name) newErrors.last_name = "Nama belakang wajib diisi!";
    if (!form.password) newErrors.password = "Password wajib diisi!";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Password tidak sama!";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios({
        method: "POST",
        url: "/registration",
        data: {
          email: form.email,
          first_name: form.first_name,
          last_name: form.last_name,
          password: form.password,
          confirmPassword: form.confirmPassword,
        },
      });
      console.log(form.first_name,"DDD");
      
      setErrors({});
      navigate("/login");
    } catch (error) {
      setErrors({ form: error.response?.data?.message || "Registrasi gagal." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-6">
      <div className="bg-white shadow-lg rounded-lg flex max-w-4xl w-full">
        {/* Form Section */}
        <div className="p-8 w-1/2">
          <div className="flex flex-col items-center mb-6">
            <img src={logoRegis} alt="Logo" className="h-12 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">SIMS PPOB</h2>
            <p className="text-sm text-gray-500">
              Lengkapi data untuk membuat akun
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Masukkan email"
                value={form.email}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="flex gap-2">
              <div className="w-1/2">
                <input
                  type="text"
                  name="first_name"
                  placeholder="Nama depan"
                  value={form.first_name}
                  onChange={handleChange}
                  className={`input input-bordered w-full ${errors.first_name ? "border-red-500" : ""}`}
                />
                {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}
              </div>

              <div className="w-1/2">
                <input
                  type="text"
                  name="last_name"
                  placeholder="Nama belakang"
                  value={form.last_name}
                  onChange={handleChange}
                  className={`input input-bordered w-full ${errors.last_name ? "border-red-500" : ""}`}
                />
                {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}
              </div>
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Masukkan password"
                value={form.password}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.password ? "border-red-500" : ""}`}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Konfirmasi password"
                value={form.confirmPassword}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.confirmPassword ? "border-red-500" : ""}`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              className="btn bg-red-600 w-full mt-4 text-white"
              disabled={loading}
            >
              {loading ? "Loading..." : "Registrasi"}
            </button>

            {errors.form && <p className="text-red-500 text-sm text-center mt-2">{errors.form}</p>}
          </form>

          <p className="text-sm text-center mt-4">
            Sudah punya akun? Login{" "}
            <span
              className="text-black cursor-pointer font-semibold hover:underline"
              onClick={() => navigate("/login")}
            >
              di sini
            </span>
          </p>
        </div>

        {/* Illustration Section */}
        <div className="w-1/2 bg-gray-50 flex items-center justify-center p-6">
          <img
            src={rekayasa}
            alt="Illustrasi Register"
            className="w-full max-w-sm"
          />
        </div>
      </div>
    </div>
  );
}
