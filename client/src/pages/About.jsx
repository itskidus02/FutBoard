import React from 'react';

export default function About() {
  return (
    <div>
      <nav className="bg-white px-4 lg:px-6 py-2.5">
        <div className="flex flex-col lg:flex-row justify-between items-center mx-auto max-w-screen-xl">
          <a href="/about" className="font-poppins hover:text-[#00684A] text-[80px] font-bold text-xl px-4 leading-[100px] lg:px-5 py-2 lg:py-2.5">
            Frequently <br /> Asked <br />questions
          </a>
          <a href="/profile" className="mt-2 lg:mt-0">
            <button className="bg-[#00684A] hover:ring-2 hover:ring-[#00684A] hover:bg-white hover:text-[#00684A] text-xl font-poppins rounded-lg text-white px-4 lg:px-16 py-2 lg:py-2.5 transition-all">
              Sign in
            </button>
          </a>
        </div>
      </nav>
    </div>
  );
}
