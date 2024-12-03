"use client";
import React, { useState } from "react";
import Image from "next/image";
import { One, Two, Three, Four } from "../../assets";
// import Dropdown from '../../components/dropdown'

const page = () => {
  const options = ["Option 1", "Option 2", "Option 3"];
  return (
    <div className="bg-white w-full max-h-full">
      <div className="flex w-full gap-3 h-full">
        <Image src={Three} alt="Three" />
        <Image src={Two} alt="Three" />
      </div>
      <div className="flex mt-3 w-full gap-3 h-full">
        <Image src={One} alt="Three" />
        <Image src={Four} alt="Three" />
      </div>
      <div className="flex-1 px-3 mt-3 w-full">
        <div className="text-lg font-semibold">Select university/region</div>
        <div className="text-sm">
          We will use this to show items & services available in your
          university/region
        </div>
      </div>
      <div>
        {/* <div>
      <h1>React Dropdown Select Menu</h1>
      <Dropdown options={options} label="Select an option:" />
    </div> */}
      </div>
      <div
        onClick={() => {}}
        className="bg-[#004AAD] mx-3 mt-8 text-center py-3 text-white rounded-xl h-[50px]"
      >
        Continue
      </div>
    </div>
  );
};

export default page;
