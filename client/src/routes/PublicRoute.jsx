import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <>
      <div className="loading-box">
        <div className="load">
          <div className="load-dot"></div>
        </div>
      </div>
    </>;
  }

  if (user) {
    return <Navigate to="/chat" replace />;
  }

  return children;
};

export default PublicRoute;