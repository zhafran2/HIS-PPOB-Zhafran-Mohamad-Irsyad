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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  // Add state for confirmation dialog
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showFailedModal, setShowFailedModal] = useState(false);
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

  // Show confirmation dialog when Pay button is clicked
  const handlePayButtonClick = () => {
    setShowConfirmation(true);
  };

  // Handle cancel button in confirmation dialog
  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  // Proceed with transaction after confirmation
  async function handleConfirmedTransaction() {
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
        setShowConfirmation(false);
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate("/transaction/history");
        }, 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Transaction failed");
      setShowConfirmation(false); // Hide confirmation dialog on error
    } finally {
      setProcessing(false);
    }
  }
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/transaction/history");
  };

  const handleCloseFailedModal = () => {
    setShowFailedModal(false);
  };
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
                      <span className="text-gray-500 sm:text-sm">💵</span>
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
                  onClick={handlePayButtonClick}
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

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-center">
                Belo listrik prabayar senilai
              </h3>
              <p className="text-2xl font-bold mt-2">
                Rp{Number(total_amount).toLocaleString()} ?
              </p>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={handleConfirmedTransaction}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded"
              >
                Ya, lanjutkan Bayar
              </button>
              <button
                onClick={handleCancelConfirmation}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-3 rounded"
              >
                Batalkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Dialog */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-center">
                Pembayaran listrik prabayar sebesar
              </h3>
              <p className="text-2xl font-bold mt-2">
                Rp{Number(total_amount).toLocaleString()}
              </p>
              <p className="text-lg font-medium text-green-500 mt-2">
                berhasil!
              </p>
            </div>

            <button
              onClick={handleCloseSuccessModal}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      )}

      {/* Failed Dialog */}
      {showFailedModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-center">
                Pembayaran listrik prabayar sebesar
              </h3>
              <p className="text-2xl font-bold mt-2">
                Rp{Number(total_amount).toLocaleString()}
              </p>
              <p className="text-lg font-medium text-red-500 mt-2">gagal</p>
            </div>

            <button
              onClick={handleCloseFailedModal}
              className="w-full text-red-600 font-medium py-3 rounded"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      )}
    </>
  );
}
