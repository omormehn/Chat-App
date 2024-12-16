import { useContext } from "react";
import avatar from "/src/avatar.svg";
import AuthContext from "../context/authContext";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import { api } from "../utils/api";
import toast from "react-hot-toast";

function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser } = useContext(AuthContext);
  

  const handleLogout = async () => {
    await api.post("auth/logout");
    updateUser(null);
    navigate("/login");
    toast.success("Logout successful");
  };

  return (
    <div>
      <div className="profile-page">
        {/* top */}
        <div className="flex  items-center justify-center">
          <div
            onClick={() => {
              navigate("/chats");
            }}
            className="absolute left-4 cursor-pointer "
          >
            <GoArrowLeft size={23} />
          </div>
          <h1 className="text-center font-bold text-xl">Profile</h1>
        </div>
        {/* top 2 */}
        <div className="md:hidden">
          <div className="avatar  relative pt-2">
            <img src={avatar} alt="Default Avatar" width={100} height={100} />
            <div
              onClick={() => {
                navigate("/profile/update");
              }}
              className="absolute bottom-0 right-0 rounded-full border-2 p-1.5 bg-slate-400"
            >
              <FaPencilAlt />
            </div>
          </div>
          <div className="m-3 flex flex-col  items-center ">
            <h1 className="font-bold font-mono text-2xl ">{user.name}</h1>
            <p>{user.email}</p>
          </div>
        </div>
        {/* Mobile Options */}
        <div className="flex md:hidden flex-col  gap-4">
          {/* opt 1 */}
          <div className="flex gap-4 items-center">
            <h1 className="font-semibold">Bio:</h1>
            <div className="border-b-2 w-full">
              <p className="py-2">{user.bio}</p>
            </div>
          </div>

          {/* opt 2 */}
          <div
            onClick={() => navigate("/forgot-password")}
            className="flex items-end cursor-pointer"
          >
            <h1 className="font-bold text-blue-600">Change Password</h1>
          </div>

          {/* opt 3 */}
          <div className="flex items-end">
            <button onClick={handleLogout} className="primary-btn px-4">
              Logout
            </button>
          </div>

          {/* opt 4 */}
          <div className="flex items-end">
            <button
              onClick={handleLogout}
              className="primary-btn bg-red-700 hover:bg-red-900 py-1 px-4"
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* Desktop Options */}
        <div className="md:flex hidden  justify-center  pt-10  gap-36  h-screen">
          {/* image */}
          <div className="">
            <div className="avatar  relative pt-2">
              <img src={avatar} alt="Default Avatar" width={100} height={100} />
              <div
                onClick={() => {
                  navigate("/profile/update");
                }}
                className="absolute bottom-0 right-0 rounded-full border-2 p-1.5 bg-slate-400"
              >
                <FaPencilAlt />
              </div>
            </div>
            <div className="m-3 flex flex-col  items-center ">
              <h1 className="font-bold font-mono text-2xl ">{user.name}</h1>
              <p>{user.email}</p>
            </div>
          </div>
          {/* options */}
          <div className="flex flex-col gap-2">
            {/* opt 1 */}
            <div className="flex gap-4 items-center">
              <h1 className="font-semibold ">Bio:</h1>
              <div className="border-b-2 w-full">
                <p className="py-2">{user.bio}</p>
              </div>
            </div>
            {/* opt 2 */}
            <div
              onClick={() => navigate("/forgot-password")}
              className="flex items-end cursor-pointer"
            >
              <h1 className="font-bold text-blue-600">Change Password</h1>
            </div>
            {/* opt 3 */}
            <div className="flex items-end">
              <button onClick={handleLogout} className="primary-btn py-1 px-4">
                Logout
              </button>
            </div>
            <div className="flex"></div>
            {/* opt 4 */}
            <div className="flex items-end">
              <button
                onClick={handleLogout}
                className="primary-btn bg-red-700 hover:bg-red-900 py-1 px-4"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
