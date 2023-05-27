import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ children }) => {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.user ? children : <Navigate to="/login" state={{ from: location }} replace />

        // CHANGE TO THIS WHEN ROLE BASED PERMISSION WORKS IN THE BACKEND
        //auth?.role?.find(role => allowedRoles?.includes(role))
        //    ? <Outlet />
        //    : auth?.user
        //        ?? // <Navigate to="/unauthorized" state={{ from: location }} replace /> 
        //        // : 
        //        <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;