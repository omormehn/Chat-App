import { useContext, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { IoLogoApple } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api.js";
import AuthContext from "../context/authContext.jsx";
import toast from "react-hot-toast";
const Login = () => {
  const [showReg, setshowReg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");

  const { updateUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const validateForm = (formData) => {
    const newErrors = {};
    let password = formData.get("password");
    let confirmPassword = formData.get("confirmpassword");

    if (!formData.get("email")) {
      newErrors.email = "Email is required.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    }
    if (showReg) {
        if (password !== confirmPassword) {
          newErrors.confirmPassword = "Password does not match";
        }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (!validateForm(formData)) {
      return;
    }
    setLoading(true);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await api.post("auth/register", {
        email,
        password,
      });
      updateUser(response.data);
      if (response.status === 200) {
        navigate("/profile-setup");
      }
    } catch (error) {
      setError(error.response.data);
    } finally {
      setLoading(false);
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (!validateForm(formData)) {
      return;
    }

    setLoading(true);

    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await api.post("auth/login", {
        email,
        password,
      });
      updateUser(response.data.user);

      toast.success(`Welcome ${response.data.user.name}`);
      if (response.status === 200) {
        navigate("/chats");
      }
    } catch (error) {
      setError(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setshowReg(!showReg);
    setError("");
    setErrors({});
  };

  return (
    <div className="bg-[#343252] bg-gradient-to-r ">
      {/* position */}
      <div className="flexCenter pt-10 overflow-auto px-10 h-screen ">
        {/* card */}
        <div
          className={`flex ${
            showReg ? "flex-row-reverse" : ""
          } bg-slate-800 card shadow-2xl`}
        >
          {/* image */}
          <div className="flex-1 hidden sm:block">
            <img src="third.jpg" alt="Login Visual" className="h-full w-full" />
          </div>
          {/* Card sections */}
          <div className="flex-1 p-6 sm:p-10 flexCol">
            {/* Intro Texts */}
            <div className="mb-4">
              <h1 className="text-3xl text-white font-serif ">
                {!showReg ? "Login" : "Signup"}
              </h1>
            </div>
            <div className="pt-2">
              <form action="" onSubmit={showReg ? handleSignup : handleLogin}>
                {/* Reg Form */}
                <div className="flex flex-col gap-4">
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="bg-slate-800 w-full text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="bg-slate-800 w-full text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>
                  {showReg && (
                    <div>
                      <input
                        type="password"
                        name="confirmpassword"
                        placeholder="Confirm Password"
                        className="bg-slate-800 w-full text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  )}
                  <p className="text-red-500 text-sm">{error.message}</p>
                  {!showReg && (
                    <p
                      onClick={() => {
                        navigate("/resetPass");
                      }}
                      className="text-blue-400 w-28 text-sm cursor-pointer hover:underline"
                    >
                      Forgot Password?
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 pt-2 text-slate-300 text-sm">
                  {showReg ? (
                    <p>Have have an account? </p>
                  ) : (
                    <p>Don&apos;t have an account? </p>
                  )}
                  <p
                    onClick={toggleForm}
                    className="text-blue-400  hover:underline cursor-pointer"
                  >
                    {showReg ? "Sign in" : "Sign up"}
                  </p>
                </div>
                {/* Button */}
                <button className="primary-btn w-full mt-4" type="submit">
                  {loading ? (
                    <div className="dots">
                      <div className="dot"></div>
                      <div className="dot"></div>
                      <div className="dot"></div>
                    </div>
                  ) : !showReg ? (
                    "Sign in"
                  ) : (
                    "Sign up"
                  )}
                </button>
              </form>
              {/* Divider */}
              <div className="flexCenter pt-4 text-slate-400 md:gap-2">
                <div className="h-px bg-white flex-1 "></div>
                {!showReg ? (
                  <p className="px-4 text-sm">Or sign in with</p>
                ) : (
                  <p className="px-4 text-sm">Or sign up with</p>
                )}
                <div className="bg-white flex-1 h-px"></div>
              </div>

              {/* Social Providers */}
              <div className="flexCol gap-4 pt-4">
                <div className="mini-card flexCenter gap-3py-2 bg-white rounded-lg  hover:bg-slate-100 hover:shadow-md transition">
                  <FcGoogle size={23} />
                  <a href="" className=" text-slate-800 font-medium ">
                    Google
                  </a>
                </div>
                <div className="mini-card flexCenter gap-3py-2 bg-white rounded-lg  hover:bg-slate-100 hover:shadow-md transition">
                  <IoLogoApple size={23} />
                  <a
                    href=""
                    className=" text-slate-800 font-medium  hover:text-slate-600"
                  >
                    Apple
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;