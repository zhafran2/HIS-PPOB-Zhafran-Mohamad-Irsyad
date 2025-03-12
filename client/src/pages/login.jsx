import { useNavigate } from "react-router";
import axios from "../helpers/axiosInstance";
import { useState } from "react";
import ilustrasi from "../assets/Illustrasi Login.png";
import logoRegis from "../assets/Logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Hapus error saat input berubah
  }

  async function handleLogin(e) {
    e.preventDefault();
    let newErrors = {};

    if (!form.email) newErrors.email = "Email wajib diisi";
    if (!form.password) newErrors.password = "Password wajib diisi";

    if (Object.keys(newErrors).length > 0) {
      return setErrors(newErrors);
    }

    try {
      setLoading(true);
      const { data } = await axios({
        method: "POST",
        url: "/login",
        data: form,
      });

      localStorage.setItem("token", data.data.token);
      console.log(data,"SSSSSSSS");
      
      navigate("/profile");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login gagal.";
      if (errorMessage.includes("email")) {
        setErrors((prev) => ({ ...prev, email: errorMessage }));
      } else if (errorMessage.includes("password")) {
        setErrors((prev) => ({ ...prev, password: errorMessage }));
      } else {
        setErrors({ email: errorMessage, password: errorMessage });
      }
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
              Masukkan email dan password untuk masuk
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Masukkan email"
                value={form.email}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Masukkan password"
                value={form.password}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="btn bg-red-600 w-full mt-4 text-white"
              disabled={loading}
            >
              {loading ? "Loading..." : "Masuk"}
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            Belum punya akun? Registrasi{" "}
            <span
              className="text-black cursor-pointer font-semibold hover:underline"
              onClick={() => navigate("/registration")}
            >
              di sini
            </span>
          </p>
        </div>

        {/* Illustration Section */}
        <div className="w-1/2 bg-gray-50 flex items-center justify-center p-6">
          <img
            src={ilustrasi}
            alt="Illustrasi Login"
            className="w-full max-w-sm"
          />
        </div>
      </div>
    </div>
  );
}
