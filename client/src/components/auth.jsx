import { Navigate, Outlet } from "react-router";
import Navbar from "./navbar";

export default function Auth() {
  const auth = localStorage.token;

  if (auth) {
    return (
      <>
        <Navbar />
        <Outlet />
      </>
    );
  }

  return <Navigate to={"/login"} />;
}
