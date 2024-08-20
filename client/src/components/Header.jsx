import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/Logo.png";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header>
      <nav className="bg-white  px-4 lg:px-6 py-2.5 ">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link to="/" className="flex items-center">
            <img src={logo} className="mr-3 h-6 sm:h-9" />
          </Link>
          <div className="flex items-center lg:order-2">
            <Link
              to="/about"
              className="font-poppins hover:text-[#00684A] font-bold text-xl px-4 lg:px-5 py-2 lg:py-2.5 mr-2"
            >
              FAQs
            </Link>
            <Link to="/profile">
              {currentUser ? (
                <img
                  src={currentUser.profilePicture}
                  alt="profile"
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <button className="bg-[#00684A] hover:ring-2 hover:ring-[#00684A] hover:bg-white hover:text-[#00684A] text-xl font-poppins  rounded-lg text-white px-4 lg:px-16 py-2 lg:py-2.5 mr-2 transition-all ">
                  Sign in
                </button>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
