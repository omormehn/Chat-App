
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { PacmanLoader } from 'react-spinners';

// eslint-disable-next-line react/prop-types
function ProtectedRoute({ children }: { children: React.ReactNode })  {
  const { user, loading } = useAuth();


  
  if(loading) {
    return (
      <div className="flexCenter h-screen">
        <PacmanLoader
          color={"#36D7B7"}
          loading={loading}
          size={50}
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  

  return children;
}

export default ProtectedRoute;
