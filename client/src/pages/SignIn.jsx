import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";
import email from "../assets/email.svg";
import password from "../assets/password.svg";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };
  return (
    <div className="flex flex-col md:flex-row justify-center items-center p-3 mt-48 max-w-screen-xl mx-auto">
      <div className="md:flex-1">
        <h1 className="lg:text-[105px] text-[70px] md:text-[80px] font-fraunces text-[#00684A] text-center font-extrabold">
          FutBoard.
        </h1>
      </div>
      <div className="md:flex-1 w-full max-w-lg md:max-w-none">
        <h1 className="lg:text-xl text-sm font-poppins text-center font-semibold my-7">
          Sign In
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative flex items-center bg-white  ring-2 ring-[#00684A] p-3 rounded-lg">
            <img src={email} alt="Email icon" className="w-6 h-6 mr-3" />
            <input
              type="email"
              placeholder="Email"
              id="email"
              className="bg-swhite outline-none flex-1"
              onChange={handleChange}
            />
          </div>

          <div className="relative flex items-center bg-white ring-2 ring-[#00684A] p-3 rounded-lg">
            <img src={password} alt="Email icon" className="w-6 h-6 mr-3" />
            <input
              type="password"
              placeholder="Password"
              id="password"
              className=" outline-none flex-1"
              onChange={handleChange}
            />
          </div>

          <OAuth />
          <button
            disabled={loading}
            className="bg-white ring-2 hover:bg-[#00684A] hover:ring-white font-poppins hover:text-white transition-all  ring-[#00684A] text-black p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>
        <div className="flex justify-between gap-2 mt-5">
          <p className="lg:text-xl text-sm  font-poppins">Dont Have an account?</p>
          <Link to="/sign-up">
            <span className="text-white hover:bg-white ring-2 transition-all hover:ring-[#00684A] hover:text-black text-md font-poppins rounded-lg lg:px-8 px-4 lg:py-2 py-1 bg-[#00684A]">
              Sign up
            </span>
          </Link>
        </div>
        <p className="text-red-700 mt-5">
          {error ? error.message || "Something went wrong!" : ""}
        </p>
      </div>
    </div>
  );
}
