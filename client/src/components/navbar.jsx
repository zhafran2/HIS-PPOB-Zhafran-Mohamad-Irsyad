import { Link, NavLink } from "react-router";
import logoRegis from "../assets/Logo.png";
export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      {/* Kiri - Logo dan Nama */}
      <NavLink to="/">
        <div className="flex items-center space-x-3">
          <img src={logoRegis} alt="Logo" className="h-10" />
          <span className="text-xl font-bold text-gray-700">SIMS PPOB</span>
        </div>
      </NavLink>

      {/* Kanan - Menu Navigasi */}
      <div className="flex space-x-6">
        <NavLink
          to="/topup"
          className={({ isActive }) =>
            isActive ? "text-red-600" : "text-gray-600 hover:text-gray-900"
          }
        >
          Top Up
        </NavLink>

        <NavLink
          to="/transaction/history"
          className={({ isActive }) =>
            isActive ? "text-red-600" : "text-gray-600 hover:text-gray-900"
          }
        >
          Transaction
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "text-red-600" : "text-gray-600 hover:text-gray-900"
          }
        >
          Akun
        </NavLink>
      </div>
    </nav>
  );
}
