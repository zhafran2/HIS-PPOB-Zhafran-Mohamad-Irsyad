import { Navigate, Outlet } from "react-router"



export default function Auth() {
    const auth = localStorage.data.token

    if(auth) {
        return <Outlet />
    }

    return <Navigate to={'/login'}/>
}