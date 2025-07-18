/* eslint-disable no-unused-vars */
import { useContext, useEffect, useRef, useState } from "react";
import defaultAvatar from "../avatar.svg";
import AuthContext from "../context/AuthContext";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

import { api } from "../utils/api";
import { toast } from "react-hot-toast";
import UploadWidget from "../utils/UploadWidget";

function UpdateProfile() {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio);

  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("bio", bio);
    formData.append("avatar", avatar);

    console.log("ava", avatar);
    try {
      const response = await api.post("update-profile/", formData);

      updateUser({ ...response.data.user });
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      toast.error("Error updating Profile!");
      console.log("er", error);
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileInput = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setAvatar(file);
    }
  };

  const handleDeleteImage = async (e) => {};

  useEffect(() => {
    setPreview(null);
  }, []);

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

        {/* Mobile Options */}
        <div className="flex flex-col md:items-center gap-4">
          {/* opt 1 */}
          <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            <div
              className="avatar relative pt-2 hover:scale-110 "
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <img
                src={avatar || user.avatar || defaultAvatar}
                alt="Default Avatar"
                width={100}
                height={100}
                className="rounded-full size-24 "
              />

              {hovered && (
                <div className="absolute inset-0 top-2 left-0 flex justify-center items-center cursor-pointer ">
                  {!avatar && (
                    <UploadWidget
                      uwConfig={{
                        cloudName: "omormehn",
                        uploadPreset: "chat-app",
                        multiple: false,
                        maxImageSize: 2000000,
                        folder: "avatars",
                      }}
                      setAvatar={setAvatar}
                    />
                  )}
                </div>
              )}
            </div>
            {/* <input
                name="avatar"
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".png, .jpg, .jpeg, .svg, .webp"
              /> */}

            <div className="flex flex-col gap-4 ">
              <h1 className="font-semibold">Name:</h1>
              <div className="border-b-2 w-full">
                <input
                  type="text"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
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
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setBio(e.target.value)}
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
      </div>
    </div>
  );
}

export default UpdateProfile;
