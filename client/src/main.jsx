import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";

import Register from "./pages/register.jsx";
import Login from "./pages/login.jsx";
import GetProfile from "./pages/profile.jsx";
import UpdateProfile from "./pages/updateProfile.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path="/registration" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/profile" element={<GetProfile />} />
        <Route path="/profile/update" element={<UpdateProfile />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
