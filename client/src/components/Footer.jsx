import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full text-[#00684A] py-4 sm:py-8 flex flex-col items-center">
      <div className="text-[#00684A] font-fraunces text-[50px] sm:text-[100px] md:text-[150px] lg:text-[200px] font-[700]">
        <div className="relative w-full max-w-screen-xl flex justify-center items-center">
          FutBoard
          <span className="absolute left-0 bottom-0 text-[8px] sm:text-[10px] md:text-[12px] lg:text-[14px]">
            © Your Company Pty. Ltd.
          </span>
          <div className="absolute right-0 bottom-0 flex space-x-2 sm:space-x-4">
            <button className="ring text-black px-2 py-1 text-[8px] sm:text-[10px] md:text-[12px] lg:text-[14px]">
           UP
            </button>
            <button className="ring text-black px-2 py-1 text-[8px] sm:text-[10px] md:text-[12px] lg:text-[14px]">
              GIT
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
