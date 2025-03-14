import { useState, useEffect } from "react";
import Saldo from "../components/Saldo";
import UserProfile from "../components/UserProfile";
import axios from "../helpers/axiosInstance";
import { useNavigate } from "react-router";

export default function Transaction() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [services, setServices] = useState([]);
  const [userBalance, setUserBalance] = useState(0);

  const [transaction_type, set_Transaction_Type] = useState("");
  const [service_code, set_Service_Code] = useState("");
  const [service_name, set_Service_name] = useState("");
  const [total_amount, set_TotalAmount] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);

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
      setError(error.response?.data?.message || "Failed to fetch services");
    }
  }

  async function fetchBalance() {
    try {
      const { data } = await axios({
        method: "GET",
        url: "/balance",
        headers: {
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
      });
      setUserBalance(data.data.balance);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  }

  useEffect(() => {
    fetchServices();
    fetchBalance();
  }, []);

  const handleServiceChange = (e) => {
    const selectedCode = e.target.value;
    if (!selectedCode) {
      setSelectedService(null);
      set_Service_Code("");
      set_Service_name("");
      set_TotalAmount("");
      setCustomAmount("");
      return;
    }

    const service = services.find((s) => s.service_code === selectedCode);
    if (service) {
      setSelectedService(service);
      set_Service_Code(service.service_code);
      set_Service_name(service.service_name);
      set_Transaction_Type("PAYMENT");

      // Set default amount from service tariff
      set_TotalAmount(service.service_tariff.toString());
      setCustomAmount(service.service_tariff.toString());
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (selectedService && selectedService.service_code === "PLN") {
      set_TotalAmount(value);
    }
  };

  async function handleTransaction(e) {
    e.preventDefault();

    // Check if user has enough balance
    if (parseFloat(total_amount) > userBalance) {
      setError("Saldo tidak mencukupi untuk melakukan transaksi ini");
      return;
    }

    try {
      setProcessing(true);
      const { data } = await axios({
        method: "POST",
        url: "/transaction",
        data: {
          transaction_type,
          service_code,
          service_name,
          total_amount,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (data.status === 0) {
        setMessage(data.message);
        navigate("/transaction/history");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Transaction failed");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <div className="ml-8 mr-8 mt-8">
        <div className="flex items-start justify-between">
          <div className="w-2/5">
            <UserProfile />
          </div>
          <div className="w-3/5">
            <Saldo />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Pembayaran</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {message}
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="mb-6">
              <label
                htmlFor="service-select"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Pilih Layanan
              </label>
              <div className="relative">
                <select
                  id="service-select"
                  value={service_code}
                  onChange={handleServiceChange}
                  className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                >
                  <option value="">-- Pilih Layanan --</option>
                  {services.map((service) => (
                    <option
                      key={service.service_code}
                      value={service.service_code}
                    >
                      <img src={service.service_icon} alt="" />
                      {service.service_name} 
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedService && (
              <>
                <div className="mb-6">
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nominal Pembayaran
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">Rp</span>
                    </div>
                    <input
                      type="text"
                      name="amount"
                      id="amount"
                      className="focus:ring-red-500 focus:border-red-500 block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md py-3"
                      placeholder="0"
                      value={customAmount}
                      onChange={handleAmountChange}
                      readOnly={selectedService.service_code !== "PLN"}
                    />
                  </div>
                  {selectedService.service_code === "PLN" && (
                    <p className="mt-2 text-sm text-gray-500">
                      *Untuk listrik, Anda dapat mengubah nominal sesuai
                      kebutuhan
                    </p>
                  )}
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-md">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Saldo Anda</span>
                    <span className="font-medium">
                      Rp {userBalance.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Total Pembayaran</span>
                    <span className="font-medium">
                      Rp {Number(total_amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 my-2 pt-2"></div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sisa Saldo</span>
                    <span
                      className={`font-medium ${
                        userBalance - Number(total_amount) < 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      Rp {(userBalance - Number(total_amount)).toLocaleString()}
                    </span>
                  </div>
                </div>

                {userBalance < Number(total_amount) && (
                  <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 p-3 rounded mb-4">
                    Saldo Anda tidak mencukupi. Silahkan lakukan top up terlebih
                    dahulu.
                  </div>
                )}

                <button
                  onClick={handleTransaction}
                  disabled={
                    processing ||
                    userBalance < Number(total_amount) ||
                    !total_amount
                  }
                  className={`w-full py-3 rounded-lg font-medium ${
                    processing ||
                    userBalance < Number(total_amount) ||
                    !total_amount
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  {processing ? "Memproses..." : "Bayar"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
