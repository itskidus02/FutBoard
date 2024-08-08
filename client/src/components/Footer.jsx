import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white py-8 flex flex-col items-center">
      <div className="text-white text-[100px] lg:text-[200px] font-bold">
        <div className="relative w-full max-w-screen-xl flex justify-center items-center">
          YourBrand
          <span className="absolute left-0 bottom-0 text-[10px] sm:text-[14px]">
            © Your Company Pty. Ltd.
          </span>
          
          <div className="absolute right-0 bottom-0 flex space-x-4">
            <button className="bg-white text-black px-4 py-2 text-[10px] sm:text-[14px]">
              Button 1
            </button>
            <button className="bg-white text-black px-4 py-2 text-[10px] sm:text-[14px]">
              Button 2
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
