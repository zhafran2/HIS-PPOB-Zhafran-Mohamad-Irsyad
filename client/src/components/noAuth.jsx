import { Navigate, Outlet } from "react-router";

export default function NoAuth() {
  const auth = localStorage.token;

  if (!auth) {
    return (
      <>
        <Outlet />
      </>
    );
  }

  return <Navigate to={"/profile"} />;
}
