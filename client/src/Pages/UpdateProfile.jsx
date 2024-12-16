/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import avatar from "../avatar.svg";
import AuthContext from "../context/authContext";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import { api } from "../utils/api";

import { toast } from "react-hot-toast";

function UpdateProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [avat, setAvatar] = useState(false);

  const { user, updateUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData(e.target);

    const { name, email, bio } = Object.fromEntries(formData);
    try {
      const response = await api.post("update-profile/", {
        name,
        email,
        bio,
        avatar: avat,
      });
      updateUser(response.data.user);
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      toast.error("Error updating Profile!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="profile-page">
        {/* top */}
        <div className="flex  items-center justify-center">
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
        {/* top 2 */}
        <div className="avatar relative pt-2">
          <img src={avatar} alt="Default Avatar" width={100} height={100} />
          <div className="absolute bottom-0 right-0 rounded-full border-2 p-1.5 bg-slate-400">
            <FaPencilAlt />
          </div>
        </div>
        {/* Mobile Options */}
        <div className="flex md:hidden flex-col gap-4">
          {/* opt 1 */}
          <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 ">
              <h1 className="font-semibold">Name:</h1>
              <div className="border-b-2 w-full">
                <input
                  type="text"
                  name="name"
                  defaultValue={user.name}
                  className="border-0 w-full"
                  required
                />
              </div>
            </div>
            {/* opt 2 */}
            <div className="flex flex-col gap-4 ">
              <h1 className="font-semibold">Email:</h1>
              <div className="border-b-2 w-full">
                <input
                  type="text"
                  name="email"
                  defaultValue={user.email}
                  required
                  className="border-0 w-full"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 ">
              <h1 className="font-semibold">Bio:</h1>
              <div className="border-b-2 w-full">
                <input
                  type="text"
                  name="bio"
                  defaultValue={user.bio}
                  required
                  className="border-0 w-full"
                />
              </div>
            </div>

            <button type="submit" className="primary-btn px-4">
              {loading ? (
                <div className="dots">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              ) : (
                "Save"
              )}
            </button>
          </form>
        </div>
        {/* Desktop Options */}
        <div className="hidden md:flex justify-center items-center pt-10">
          <form
            className="flex flex-col gap-8"
            action=""
            onSubmit={handleSubmit}
          >
            {/* opt 1 */}
            <div className="flex flex-col gap-4 ">
              <h1 className="font-semibold">Name:</h1>
              <div className="border-b-2 ">
                <input
                  type="text"
                  defaultValue={user.name}
                
                  className="border-0 w-full"
                />
              </div>
            </div>
            {/* opt 2 */}
            <div className="flex flex-col gap-4 ">
              <h1 className="font-semibold">Email:</h1>
              <div className="border-b-2 w-full">
                <input
                  type="text"
                  defaultValue={user.email}
                  className="border-0 w-full"
                />
              </div>
            </div>
            {/* opt 3 */}
            <div className="flex flex-col gap-4 ">
              <h1 className="font-semibold">Bio:</h1>
              <div className="border-b-2 ">
                <input
                  type="text"
                  defaultValue={user.bio}
                  className="border-0 w-full"
                />
              </div>
            </div>
            <button type="submit" className="primary-btn px-4">
              {loading ? (
                <div className="dots">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              ) : (
                "Save"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfile;
