import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "../helpers/axiosInstance";

import Services from "../components/services";
import Banners from "../components/banners";
import Saldo from "../components/saldo";
import UserProfile from "../components/UserProfile";

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
