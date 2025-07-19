import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";

// Component for reset from login=> resetPass
const ResetPass = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  return (
    <div className="flexCol h-screen  justify-center items-center gap-8">
      <div
        onClick={() => {
          navigate("/login");
        }}
        className="absolute top-4 left-4 cursor-pointer "
      >
        <GoArrowLeft size={23} />
      </div>
      <h1 className="font-serif">
        Oops, seems you forgot your password. <br /> Do not worry, we&apos;ve
        got your back
      </h1>
      <div className="border-b-2 relative  border-black">
        <input
          className="py-2 px-4 border-0  "
          type="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email"
        />
      </div>
      <button
        type="submit"
        onClick={() => navigate("/passReset", { state: { email } })}
        className="primary-btn px-5"
      >
        Next
      </button>
    </div>
  );
};

export default ResetPass;
