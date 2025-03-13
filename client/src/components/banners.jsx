import { useEffect, useState } from "react";

import axios from "../helpers/axiosInstance";
export default function Banners({ errors, setErrors }) {
  const [banners, setBannners] = useState([]);

  async function fetchBanners() {
    try {
      const { data } = await axios({
        method: "GET",
        url: "/banner",
        headers: {
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
      });
      setBannners(data.data);
    } catch (error) {
      setErrors(error.response.data.message);
    }
  }

  useEffect(() => {
    fetchBanners();
  }, []);
  return (
    <>
      <div className="mt-6 grid grid-cols-5 gap-2">
        {banners.map((banner, index) => (
          <img
            key={index}
            src={banner.banner_image}
            alt="Promo Banner"
            className="rounded-lg shadow"
          />
        ))}
      </div>
    </>
  );
}
