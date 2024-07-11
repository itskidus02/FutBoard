import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="rounded-lg mx-auto backdrop-blur-3xl fixed top-0 left-0 right-0 bg-transparent mt-5 shadow-2xl  z-50 md:w-5/12">
        <div className="flex justify-between items-center max-w-6xl p-3">
        <Link to="/">
          <h1 className="font-bold text-xl md:text-2xl">SoccerBoard</h1>
        </Link>
        <ul className="flex gap-4 text-sm md:text-base">
          <Link to="/">
            <li>Home</li>
          </Link>
          <Link to="/about">
            <li>About</li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.profilePicture}
                alt="profile"
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              
              <li>Sign In</li>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
}
