// import { Accordion } from '@/components/ui/accordion';
import { AccordionDemo } from "@/components/Demo/AccordionDemo";
import React from "react";

export default function About() {
  return (
    <div>
      <nav className="bg-white px-4 lg:px-6 py-2.5">
        <div className="flex flex-col lg:flex-row justify-between items-center mx-auto max-w-screen-xl">
          <a
            className="font-fraunces lg:text-[90px] md:text-[60px] font-bold text-4xl px-4 lg:leading-[100px] md:leading-[60px]  lg:px-5 py-2 lg:py-2.5"
          >
            Frequently <br /> Asked <br /> <span className="text-[#00684A]">Questions</span>
          </a>
          <div className="mt-2 lg:mt-0 lg:self-start">
            <AccordionDemo />

          </div>
        </div>
      </nav>
    </div>
  );
}
