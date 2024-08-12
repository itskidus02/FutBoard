import { AccordionDemo } from "@/components/Demo/AccordionDemo";
import React from "react";

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center bg-white">
      <nav className="w-full px-4 lg:px-6 py-2.5">
        <div className="flex flex-col lg:flex-row mx-auto max-w-screen-xl w-full">
          <a
            className="font-fraunces text-center lg:text-[90px] md:text-[60px] font-bold text-4xl px-4 lg:leading-[100px] md:leading-[60px] lg:px-5 py-2 lg:py-2.5"
          >
            Frequently <br /> Asked <br /> <span className="text-[#00684A]">Questions</span>
          </a>
          <div className="mt-4 w-full">
            <AccordionDemo />
          </div>
        </div>
      </nav>
    </div>
  );
}
