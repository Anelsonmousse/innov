"use client";

import React from "react";
import { items } from "./../../../../dev/services";
import Image from "next/image";

import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";

const page = ({ params }) => {
  const router = useRouter();
  const ServiceList = ({ items }) => {
    return (
      <div className=" w-full">
        <div className="flex-1 w-full">
          {items.map((item, index) => (
            <div
              key={index}
              className="w-[90%] flex-1 rounded-lg bg-[#D9D9D9] justify-between my-2 ml-[5%] px-3"
            >
              <div className="w-full justify-between pt-2 flex">
                <div className="text-lg font-bold">{item.name}</div>
                <div className="text-sm font-normal">{item.job}</div>
              </div>
              <div className="w-full flex mt-2 pb-2 justify-between">
                <div className="text-sm text-white bg-[#004AAD] rounded-md h-6 text-wrap px-2 pb-[2px]">
                  Call Seller
                </div>
                <div className="text-sm text-[#004AAD] border-[#004AAD] h-6 text-wrap px-2 pb-[2px] border-2 rounded-md">
                  Message on Whatsapp
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="w-full pb-3 pt-3 flex-1">
        <div className="z-30 justify-between flex relative">
          <IoArrowBack
            onClick={() => {
              router.back();
            }}
            color="black"
            className="mb-1 ml-3"
            size={30}
          />
          <div className="flex pt-1 font-semibold text-lg w-full pl-3">
            Services
          </div>
        </div>
        <input
          type="text"
          value=""
          className="bg-[#D9D9D9] h-8 text-sm pl-2 w-[90%] ml-[5%] rounded-lg"
          placeholder="Search"
        />
      </div>
      <ServiceList items={items} />
    </div>
  );
};

export default page;