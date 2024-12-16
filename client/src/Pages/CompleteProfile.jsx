/* eslint-disable no-unused-vars */
import { useState } from "react";
import { api } from "../utils/api";
import { useContext } from "react";
import AuthContext from "../context/authContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CompleteProfile = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await api.post("auth/profile-setup", {
        name,
        bio,
        avatar,
      });
      updateUser(res.data);
      toast.success("You are all set!")
      navigate('/chats')
    } catch (error) {
      setError(error.response.data);
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="container">
      {/* Intro Message */}
      <div className="intro-section">
        <h1 className="greeting typewrite">Hey there 👋</h1>
        <p className="welcome-message typewrite">Welcome to Chat App</p>
        <p className="text-sm md:text-base typewriter">
          Few more things to fill up and you are good to go
        </p>
      </div>

      {/* Profile Setup Form */}
      <form className="profile-form" onSubmit={handleSubmit}>
        <label className="flex gap-5 items-center   ">
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="flex items-center gap-5 ">
          Bio:
          <textarea
            required
            className="ml-4"
            type="textarea"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder=""
          />
        </label>
        <p className="text-red-500 text-sm">{error.message}</p>
        <button type="submit">
          {loading ? (
            <div className="dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          ) : (
            "Save Profile"
          )}
        </button>
      </form>
    </div>
  );
};

export default CompleteProfile;
