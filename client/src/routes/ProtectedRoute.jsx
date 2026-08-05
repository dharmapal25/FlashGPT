import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {

    const { user, loading, error } = useAuth()

    if (loading) {
        return <>
        <div className="loading-box">
            <div className="load">
                <div className="load-dot"></div>
            </div>
        </div>
        </>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;