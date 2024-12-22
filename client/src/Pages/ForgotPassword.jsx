import { useContext, useState } from "react";
import { api } from "../utils/api";
import AuthContext from "../context/authContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";


const ForgotPassword = () => {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Password Does not match")
      return;
    }

    try {
      const response = await api.post("/auth/forgotPassword", {
        password: oldPassword,
        newPass: newPassword,
        email: user.email,
      });
      if (user) {
        updateUser(response.data.user);
        navigate('/profile');
      }
      navigate('/login')
      toast.success("Password updated successfully!");
    } catch (error) {
      toast.error("Password update failed!");
      setError(error.response.data.message)
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center relative top-4">
        <div
          onClick={() => {
            navigate("/profile");
          }}
          className="absolute left-4 cursor-pointer "
        >
          <GoArrowLeft size={23} />
        </div>
        <h1 className="text-center font-bold text-xl">Edit Profile</h1>
      </div>
      <div className="flex h-screen justify-center">
        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div>
            <label htmlFor="old-password">Old Password</label>
            <input
              type="password"
              id="old-password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter old password"
              required
            />
          </div>
          <div>
            <label htmlFor="new-password">New Password</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>
          <div>
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>
          <p className="text-red-800 font-semibold">{error}</p>
          <button className="primary-btn" type="submit">Update Password</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
