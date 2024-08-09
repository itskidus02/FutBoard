import React from "react";
import git from "../assets/github.svg";
import arrowtop from "../assets/arrowtop.svg";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Optional: smooth scrolling behavior
    });
  };

  return (
    <footer className="w-full text-[#00684A] py-4 sm:py-8 flex flex-col items-center">
      <div className="text-[#00684A] font-fraunces text-[100px] sm:text-[100px] md:text-[150px] lg:text-[200px] font-[700]">
        <div className="relative w-full max-w-screen-xl flex justify-center items-center">
          FutBoard
          <span className="absolute left-0 bottom-0 text-[8px] sm:text-[10px] md:text-[12px] lg:text-[14px]">
            <a
              href="https://github.com/itskidus02"
              target="_blank"
              rel="noopener noreferrer"
            >
              by kidus @2024
            </a>
          </span>
          <div className="absolute right-0 bottom-0 flex space-x-2 sm:space-x-4">
            <button
              className="ring-1 ring-[#00684A] text-black lg:px-2 lg:py-2 py-3 mt-4 px-3 text-[8px] sm:text-[10px] md:text-[12px] lg:text-[14px]"
              onClick={scrollToTop} // Call scrollToTop function on button click
            >
              <img
                src={arrowtop}
                className="lg:w-8 lg:h-8 w-2 h-2"
                alt="Scroll to top"
              />
            </button>
            <a
              href="https://github.com/itskidus02/SoccerBoard"
              target="_blank"
              rel="noopener noreferrer"
              className="ring-1 ring-[#00684A] text-black lg:px-2 lg:py-2 py-3 mt-4 px-3 text-[8px] md:text-[12px] lg:text-[14px]"
            >
              <img src={git} className="lg:w-8 lg:h-8 w-2 h-2" alt="GitHub" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
