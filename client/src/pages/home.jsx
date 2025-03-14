

import Services from "../components/services";
import Banners from "../components/banners";

import UserProfile from "../components/UserProfile";
import Saldo from "../components/Saldo";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 px-6 pt-4">
      {/* Header & Saldo dalam 1 Flex Container */}
      <div className="flex flex-col md:flex-row items-start gap-4">
        {/* User Profile (Lebih kecil) */}
        <div className="w-full md:w-[35%]">
          <UserProfile />
        </div>

        {/* Saldo Section (Lebih besar) */}
        <div className="w-full md:w-[65%]">
          <Saldo />
        </div>
      </div>

      {/* Services Section */}
      <Services />

      {/* Promo Section */}
      <Banners />
    </div>
  );
}
