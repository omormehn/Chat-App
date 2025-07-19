
import { useAuth } from "../context/AuthContext";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { TiEdit } from "react-icons/ti";
import { api } from "../utils/api";
import toast from "react-hot-toast";

function ProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();


  const handleLogout = async () => {
    await api.post("update-profile/", {
      lastSeen: new Date(Date.now()),
    });
    await api.post("auth/logout");
    setUser(null);
    navigate("/login");
    toast.success("Logout successful");
  };

  return (
    <div className="">
      <div className="p-5 flexCenter flex-col">
        {/* top */}
        <div
          onClick={() => {
            navigate("/chats");
          }}
          className="absolute left-4 top-5 cursor-pointer "
        >
          <GoArrowLeft size={23} />
        </div>
        <h1 className="text-center font-bold text-xl pb-10">Profile</h1>

        {/* top 2 */}
        <div className="border-black border-2 px-24  pb-8 rounded-md relative">
          <div className="m-8">
            <div
              onClick={() => {
                navigate("/profile/update");
              }}
              className="absolute right-4 top-5 cursor-pointer"
            >
              <TiEdit size={23} />
            </div>
            <div className="avatar relative ">
              <img
                src={user?.avatar || "image.png"}
                alt="Default Avatar"
                className="rounded-full size-24"
              />
            </div>
            <div className="m-3 flex flex-col  items-center ">
              <h1 className="font-bold font-mono text-xl ">{user?.name}</h1>
              <p>{user?.email}</p>
            </div>
            <div className="text-sm text-center font-bold">
              <p>{user?.bio}</p>
            </div>
          </div>
          <div className="flexCenter flex-col  gap-2">
            {/* opt 1 */}
            <div
              onClick={() => navigate("/forgot-password")}
              className="flex items-end cursor-pointer"
            >
              <h1 className="font-bold text-blue-600">Change Password</h1>
            </div>
            {/* opt 2 */}
            <div className="flex items-end">
              <button onClick={handleLogout} className="primary-btn px-4">
                Logout
              </button>
            </div>

            {/* opt 3 */}
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
