import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Chats from "./Pages/Chats";

import ProfilePage from "./Pages/ProfilePage";
import CompleteProfile from "./Pages/CompleteProfile";
import UpdateProfile from "./Pages/UpdateProfile";
import ForgotPassword from "./Pages/ForgotPassword";

import { Toaster } from "react-hot-toast";
import ResetPass from "./Pages/ResetPass";
import PassWordReset from "./Components/PassWordReset";
import ProtectedRoute from "./context/ProtectedRoute";
import PublicRoutes from "./context/PublicRoutes";


function App() {

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="*" element={
          <PublicRoutes>
            <Login />
          </PublicRoutes>
        } />
        <Route path="/login" element={<PublicRoutes>
          <Login />
        </PublicRoutes>} />
        <Route path="/resetPass" element={<ResetPass />} />
        <Route path="/passReset" element={<PassWordReset />} />
        <Route path="/profile-setup" element={<CompleteProfile />} />
        
        {/* Protected Routes */}
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chats"
          element={
            <ProtectedRoute>
              <Chats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/update"
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
