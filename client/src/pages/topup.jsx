import { useState } from "react";
import Saldo from "../components/Saldo";
import UserProfile from "../components/UserProfile";
import axios from "../helpers/axiosInstance";
import { useNavigate } from "react-router";

export default function TopUp() {
  const [processing, setIsProcessing] = useState(false);
  const [top_up_amount, setTop_Up_Amount] = useState(0);
  const [errors, setErrors] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const navigate = useNavigate();

  const predefinedAmounts = [10000, 20000, 50000, 100000, 250000, 500000];

  // Show confirmation dialog when Top Up button is clicked
  const handleTopUpButtonClick = () => {
    setShowConfirmation(true);
  };

  // Handle cancel button in confirmation dialog
  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  async function handleConfirmedTopUp() {
    setErrors("");
    setSuccessMessage("");

    try {
      setIsProcessing(true);
      const { data } = await axios({
        method: "POST",
        url: "/topup",
        data: {
          top_up_amount,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (data.status === 0) {
        setSuccessMessage(data.message);
        setShowSuccessPopup(true);
        // Wait 2 seconds then navigate
        setTimeout(() => {
          navigate("/transaction");
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Terjadi kesalahan";
      setErrors(errorMessage);
      setShowErrorPopup(true);
      setShowConfirmation(false);
    } finally {
      setIsProcessing(false);
      setShowConfirmation(false);
    }
  }

  // Close success popup
  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    navigate("/transaction");
  };

  // Close error popup
  const handleCloseErrorPopup = () => {
    setShowErrorPopup(false);
  };

  return (
    <div className="ml-8 mr-8 mt-8">
      {/* Header: User Profile & Saldo */}
      <div className="flex items-start justify-between">
        <div className="w-2/5 ">
          <UserProfile />
        </div>
        <div className="w-3/5 ">
          <Saldo />
        </div>
      </div>

      {/* Form Top Up */}
      <div className="mt-6 grid grid-cols-3 gap-6">
        {/* Input & Button */}
        <div className="col-span-2">
          <p className="text-xl">Silahkan masukkan</p>
          <h3 className="text-2xl font-bold mb-4">Nominal Top Up</h3>

          {/* Input Nominal */}
          <input
            type="number"
            value={top_up_amount}
            onChange={(e) => setTop_Up_Amount(Number(e.target.value))}
            placeholder="Masukkan nominal Top Up"
            className="w-full p-3 border rounded-md mb-4"
          />

          {/* Tombol Top Up */}
          <button
            onClick={handleTopUpButtonClick}
            disabled={
              processing || top_up_amount < 10000 || top_up_amount > 1000000
            }
            className={`w-full py-3 text-white rounded-md text-lg font-bold ${
              processing || top_up_amount < 10000 || top_up_amount > 1000000
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {processing ? "Memproses..." : "Top Up"}
          </button>

          {/* Pesan Sukses */}
          {successMessage && (
            <p className="text-green-500 text-sm mt-2">{successMessage}</p>
          )}

          {/* Pesan Error */}
          {errors && <p className="text-red-500 text-sm mt-2">{errors}</p>}
        </div>

        {/* Opsi Nominal */}
        <div className="grid grid-cols-3 gap-3 h-3 mt-19">
          {predefinedAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => setTop_Up_Amount(amount)}
              className="p-3 border border-gray-400 rounded-md hover:bg-gray-200 text-center"
            >
              Rp{amount.toLocaleString("id-ID")}
            </button>
          ))}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex flex-col items-center mb-4">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-center">
                Top Up saldo senilai
              </h3>
              <p className="text-2xl font-bold mt-2">
                Rp{top_up_amount.toLocaleString()} ?
              </p>
            </div>

            <div className="flex flex-col space-y-2">
              <button
                onClick={handleConfirmedTopUp}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded"
              >
                Ya, lanjutkan Top Up
              </button>
              <button
                onClick={handleCancelConfirmation}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded"
              >
                Batalkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex flex-col items-center mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-center">
                Top Up sebesar
              </h3>
              <p className="text-2xl font-bold mt-2">
                Rp{top_up_amount.toLocaleString()}
              </p>
              <p className=" font-medium mt-2">berhasil!</p>
            </div>

            <div className="flex flex-col space-y-2">
              <button
                onClick={handleCloseSuccessPopup}
                className="w-full text-red-600 font-medium py-2 rounded"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showErrorPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex flex-col items-center mb-4">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-center">Top Up Gagal</h3>
              <p className="text-red-500 text-center mt-2">{errors}</p>
            </div>

            <div className="flex flex-col space-y-2">
              <button
                onClick={handleCloseErrorPopup}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
