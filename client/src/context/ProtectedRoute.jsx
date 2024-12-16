
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/authContext";
import { PacmanLoader } from 'react-spinners';

// eslint-disable-next-line react/prop-types
function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);


  
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
