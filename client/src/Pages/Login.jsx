import { useContext, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { IoLogoApple } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext.jsx";
import { Typography } from "@material-tailwind/react";
import InputComponent from "../Components/InputComponent.jsx";

const Login = () => {
  const [showReg, setshowReg] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  // const [error, setError] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const { login, register, loading, error, setError } = useContext(AuthContext);

  const navigate = useNavigate();

  const togglePassword = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const validateForm = (formData) => {
    const newErrors = {};
    let password = formData.get("password");
    let confirmPassword = formData.get("confirm-password");

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
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await register(email, password);
      if (response.status === 200) {
        navigate("/profile-setup");
      }
    } catch (error) {
      console.log("error in signup", error);
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (!validateForm(formData)) {
      return;
    }
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      await login(email, password);
    } catch (error) {
      console.log("login error", error);
    }
  };

  const toggleForm = () => {
    setshowReg(!showReg);
    setError("");
    setErrors({});
  };

  return (
    <div className="bg-[#343252] overflow-hidden bg-gradient-to-r ">
      {/* position */}
      <div className="flexCenter  md:pt-5 overflow-hidden  ">
        {/* card */}
        <div
          className={`flex items-center justify-center w-[700px] overflow-hidden min-h-dvh max-w-full md:rounded-2xl ${
            showReg ? "flex-row-reverse" : ""
          } bg-slate-800  card`}
        >
          {/* Card sections */}
          <div className="flex-1 bg-black p-6 sm:p-10 flexCol">
            {/* Intro Texts */}
            <div className="mb-4">
              <h1 className="text-3xl text-white font-serif ">
                {!showReg ? "Login" : "Signup"}
              </h1>
            </div>

            <div className="pt-2">
              <form action="" onSubmit={showReg ? handleSignup : handleLogin}>
                {/* login and reg Form */}
                <div className="flex flex-col gap-6">
                  <div className="bg-slate-800">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      autoFocus
                      className="auth-inputs w-full bg-black "
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <InputComponent
                      name="password"
                      placeholder="Password"
                      isPasswordVisible={isPasswordVisible}
                      togglePassword={togglePassword}
                    />
                    <p className="text-red-500 pt-4">{error}</p>
                    <div>
                      {errors.password ? (
                        <p className="text-red-500 text-sm">
                          {errors.password}
                        </p>
                      ) : (
                        showReg && (
                          <Typography
                            variant="small"
                            color="gray"
                            className="mt-2 flex items-center gap-1 font-normal"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="-mt-px h-4 w-4"
                            >
                              <path
                                fillRule="evenodd"
                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Use at least 8 characters, one uppercase, one
                            lowercase and one number and a special character.
                          </Typography>
                        )
                      )}
                    </div>
                  </div>

                  {showReg && (
                    <div>
                      <InputComponent
                        name="confirm-password"
                        placeholder="Confirm Password"
                        isPasswordVisible={isPasswordVisible}
                        togglePassword={togglePassword}
                      />

                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm pt-2">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  )}

                  {error.message && (
                    <p className="text-red-500 text-sm pt-2">{error.message}</p>
                  )}
                </div>

                {/* forgot password */}
                <div className="py-4 pt-4">
                  {!showReg && (
                    <p
                      onClick={() => {
                        navigate("/resetPass");
                      }}
                      className="text-blue-400  text-sm cursor-pointer hover:underline"
                    >
                      Forgot Password?
                    </p>
                  )}
                </div>

                {/* have an account */}
                <div
                  className={`flex flex-row gap-2 text-white text-slate-300 text-sm`}
                >
                  {showReg ? (
                    <p className="">Have have an account? </p>
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
                <button className="primary-btn w-full mt-12 " type="submit">
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
              <div className="flexCenter pt-14 text-white md:gap-2">
                <div className="h-px bg-white flex-1  "></div>
                {!showReg ? (
                  <p className="px-4 text-sm ">Or sign in with</p>
                ) : (
                  <p className="px-4 text-sm">Or sign up with</p>
                )}
                <div className="bg-white flex-1 h-px"></div>
              </div>

              {/* Social Providers */}
              <div className="flexCenter gap-4 pt-4">
                <div className="mini-card flexCenter  rounded-lg  hover:bg-slate-100 hover:shadow-md transition">
                  <FcGoogle size={23} />
                </div>
                <div className="mini-card flexCenter    rounded-lg  hover:bg-slate-100 hover:shadow-md transition">
                  <IoLogoApple size={25} color="white" />
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
