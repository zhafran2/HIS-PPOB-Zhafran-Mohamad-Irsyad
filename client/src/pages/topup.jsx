import { useState } from "react";
import Saldo from "../components/saldo";
import UserProfile from "../components/UserProfile";
import axios from '../helpers/axiosInstance'
import { useNavigate } from "react-router";
export default function TopUp() {
  const [processing, setIsProcessing] = useState(false);
  const [top_up_amount, setTop_Up_Amount] = useState(0);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate =useNavigate()
  async function handleTopUp(e) {
    e.preventDefault();
    try {
      setIsProcessing(true);

      const {data} =await axios({
        method:"POST",
        url:'/topup',
        data: {
          top_up_amount
        },
        headers: {
          Authorization: `bearer ${localStorage.getItem("token")}`,
        }
      })

      navigate('/')
    } catch (error) {
      setErrors(error.response.data.message);
    }
  }
  return (
    <>
      <div className="min-h-screen bg-gray-100 px-6 pt-4">
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="w-full md:w-[35%]">
            <UserProfile />
            <p>Silahkan masukkan</p>
            <p className="text-2xl">
              {" "}
              <b>Nominal Top Up</b>
            </p>
          </div>

          <div className="w-full md:w-[65%]">
            <Saldo />
          </div>
        </div>
      </div>
    </>
  );
}
