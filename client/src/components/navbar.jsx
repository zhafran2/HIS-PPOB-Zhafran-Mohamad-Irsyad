
import { Link } from "react-router";
import logoRegis from "../assets/Logo.png";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      {/* Kiri - Logo dan Nama */}
      <div className="flex items-center space-x-3">
        <img src={logoRegis} alt="Logo" className="h-10" />
        <span className="text-xl font-bold text-gray-700">SIMS PPOB</span>
      </div>

      {/* Kanan - Menu Navigasi */}
      <div className="flex space-x-6">
        <Link to="/topup" className="text-gray-600 hover:text-gray-900">
          Top Up
        </Link>
        <Link to="/transaction" className="text-gray-600 hover:text-gray-900">
          Transaction
        </Link>
        <Link to="/account" className="text-gray-600 hover:text-gray-900">
          Akun
        </Link>
      </div>
    </nav>
  );
}
