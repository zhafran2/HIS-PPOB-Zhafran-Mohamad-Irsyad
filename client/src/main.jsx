import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";

import Register from "./pages/register.jsx";
import Login from "./pages/login.jsx";
import GetProfile from "./pages/home.jsx";
import UpdateProfile from "./pages/updateProfile.jsx";
import NoAuth from "./components/noAuth.jsx";
import Auth from "./components/auth.jsx";
import TopUp from "./pages/topup.jsx";
import Transaction from "./pages/transaction.jsx";
import TransactionHistory from "./pages/transactionHistory.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<NoAuth />}>
          <Route path="/registration" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<Auth />}>
          <Route path="/" element={<GetProfile />} />
          <Route path="/topup" element={<TopUp />} />

          <Route path="/profile/update" element={<UpdateProfile />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/transaction/history" element={<TransactionHistory/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
