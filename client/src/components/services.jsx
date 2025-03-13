import axios from "../helpers/axiosInstance";
import { useEffect, useState } from "react";
export default function Services({ errors, setErrors }) {
  const [services, setServices] = useState([]);
  async function fetchServices() {
    try {
      const { data } = await axios({
        method: "GET",
        url: "/services",
        headers: {
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
      });
      setServices(data.data);
    } catch (error) {
      setErrors(error.response.data.message);
    }
  }
  useEffect(() => {
    fetchServices();
  }, []);
  return (
    <>
      <div className="grid grid-cols-12 gap-4 mt-6 text-center">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white p-4 rounded-lg shadow"
          >
            <img
              src={service.service_icon}
              alt={service.service_name}
              className="w-12 h-12"
            />
            <p className="text-sm mt-2 font-medium">{service.service_name}</p>
          </div>
        ))}
      </div>
    </>
  );
}
