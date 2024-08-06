import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center font-fraunces mt-32 bg-white text-center mx-auto p-4">
      <div className="text-4xl sm:text-5xl text-[#00684A] lg:text-[52px]">404</div>
      <div className="mt-10 font-fraunces text-5xl md:text-[50px] text-[#00684A] lg:text-[72px] mb-10">Page not found</div>
      <div className="mt-9">
        <Link to="/" className="text-xl bg-[#00684A] hover:ring-2 hover:ring-[#00684A] hover:bg-white hover:text-[#00684A] font-fraunces rounded-lg text-white px-4 lg:px-5 md:px-10 py-2 lg:py-2.5 transition-all sm:text-xl">
          Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
